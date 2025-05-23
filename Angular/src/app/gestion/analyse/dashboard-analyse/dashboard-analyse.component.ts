import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AnalyseService } from '../services/analyse.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-dashboard-analyse',
  templateUrl: './dashboard-analyse.component.html',
  styleUrls: ['./dashboard-analyse.component.scss']
})
export class DashboardAnalyseComponent  implements OnInit {

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  dashboardForm!: FormGroup;
  totalEvaluations = 0;
  bonnesCount = 0;
  mauvaisesCount = 0;
  bonnesEvaluationsTop3 = '';
  mauvaisesEvaluationsTop3 = '';
  analyseResult: any;
  nombrePostesNonEvalues: number = 0;


  evaluationQualityChartOptions: any;
  evaluationTrendChartOptions: any;

  services: any[] = [];
  filteredPosts: any[] = [];

  private allEvaluations: any[] = []; // garder toutes les évaluations chargées

  constructor(private analyseService: AnalyseService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadServices();

    this.dashboardForm.get('selectedServiceId')?.valueChanges.subscribe(serviceId => {
      this.onServiceChange(serviceId);
    });

    // Quand les dates changent, on met à jour les charts
    this.dashboardForm.get('startDate')?.valueChanges.subscribe(() => this.applyFilters());
    this.dashboardForm.get('endDate')?.valueChanges.subscribe(() => this.applyFilters());

    this.analyseService.getallEvaluations().subscribe(evaluations => {
      this.allEvaluations = evaluations;
      this.applyFilters(); // premier affichage avec toutes les données
    });
this.dashboardForm.valueChanges.subscribe(() => {
  this.loadAnalyseData();
  this.chargerNombrePostesNonEvalues();
});

  }

 chargerNombrePostesNonEvalues(): void {
  const dateDebut = this.dashboardForm.get('startDate')?.value;
  const dateFin = this.dashboardForm.get('endDate')?.value;

  if (dateDebut && dateFin) {
    this.analyseService.getNombrePostesNonEvalues(dateDebut, dateFin).subscribe({
      next: result => this.nombrePostesNonEvalues = result,
      error: err => {
        console.error('Erreur lors de l’analyse des postes non évalués', err);
        this.nombrePostesNonEvalues = 0;
      }
    });
  } else {
    this.nombrePostesNonEvalues = 0;
  }
}


  initForm() {
    this.dashboardForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      selectedServiceId: [''],
      selectedPostId: ['']
    });
  }

  loadServices() {
    this.analyseService.getallservices().subscribe(data => {
      this.services = data;
    });
  }

  onServiceChange(serviceId: number) {
    if (serviceId) {
      this.analyseService.getpostByservice(serviceId).subscribe(posts => {
        this.filteredPosts = posts;
        this.dashboardForm.get('selectedPostId')?.setValue('');
      });
    } else {
      this.filteredPosts = [];
      this.dashboardForm.get('selectedPostId')?.setValue('');
    }
  }

applyFilters() {
  const startDateStr = this.dashboardForm.get('startDate')?.value;
  const endDateStr = this.dashboardForm.get('endDate')?.value;
  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  const selectedPostId = +this.dashboardForm.get('selectedPostId')?.value;

  let filteredEvals = this.allEvaluations;

  if (startDate) {
    filteredEvals = filteredEvals.filter(e => new Date(e.date) >= startDate);
  }

  if (endDate) {
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    filteredEvals = filteredEvals.filter(e => new Date(e.date) <= endOfDay);
  }

  if (selectedPostId) {
    this.analyseService.getEmployeesByPost(selectedPostId).subscribe(employees => {
      const employeeIds = employees.map(emp => emp.id);
      const postFilteredEvals = filteredEvals.filter(e => employeeIds.includes(e.employee?.id));
      this.processEvaluations(postFilteredEvals);
    });
  } else {
    this.processEvaluations(filteredEvals);
  }
}


  processEvaluations(evaluations: any[]) {
    const niveaux = ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'EXPERT'];
    const niveauIndex = (niveau: string) => niveaux.indexOf(niveau);
    const niveauToValue = (niveau: string) => niveaux.indexOf(niveau) + 1;

    const bestEvaluationsMap = new Map<string, any>();
    for (const evaluation of evaluations) {
      const key = `${evaluation.employee?.id}-${evaluation.competence?.id}`;
      if (!bestEvaluationsMap.has(key)) {
        bestEvaluationsMap.set(key, evaluation);
      } else {
        const currentBest = bestEvaluationsMap.get(key);
        if (niveauIndex(evaluation.niveau) > niveauIndex(currentBest.niveau)) {
          bestEvaluationsMap.set(key, evaluation);
        }
      }
    }

    let bonnes = 0;
    let mauvaises = 0;
    for (const evaluation of bestEvaluationsMap.values()) {
      if (['AVANCE', 'EXPERT'].includes(evaluation.niveau)) {
        bonnes++;
      } else {
        mauvaises++;
      }
    }

    this.bonnesCount = bonnes;
    this.mauvaisesCount = mauvaises;

    this.bonnesEvaluationsTop3 = Array.from(bestEvaluationsMap.values())
      .filter(e => ['AVANCE', 'EXPERT'].includes(e.niveau))
      .sort((a, b) => niveauIndex(b.niveau) - niveauIndex(a.niveau))
      .slice(0, 3)
      .map(e => `${e.competence?.code || 'N/A'} (${e.niveau})`)
      .join('<br/>');

    this.mauvaisesEvaluationsTop3 = Array.from(bestEvaluationsMap.values())
      .filter(e => ['DEBUTANT', 'INTERMEDIAIRE'].includes(e.niveau))
      .sort((a, b) => niveauIndex(a.niveau) - niveauIndex(b.niveau))
      .slice(0, 3)
      .map(e => `${e.competence?.code || 'N/A'} (${e.niveau})`)
      .join('<br/>');

    this.setEvaluationQualityChart();

    // --- Graphique en ligne
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthLabels: string[] = [];
    const monthlySums: { [key: string]: number[] } = {};

    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = date.toLocaleString('default', { month: 'short' });
      monthLabels.unshift(label);
      monthlySums[label] = [];
    }

    evaluations.forEach(evaluation => {
      const date = new Date(evaluation.date);
      if (date >= sixMonthsAgo) {
        const label = date.toLocaleString('default', { month: 'short' });
        if (monthlySums[label]) {
          monthlySums[label].push(niveauToValue(evaluation.niveau));
        }
      }
    });

    const moyenneParMois: number[] = monthLabels.map(label => {
      const values = monthlySums[label];
      if (values.length === 0) return null;
      const sum = values.reduce((a, b) => a + b, 0);
      return +(sum / values.length).toFixed(2);
    });

    this.setLineChartOptions(monthLabels, moyenneParMois);
  }

  setEvaluationQualityChart(): void {
    this.evaluationQualityChartOptions = {
      title: {
        left: 'center',
        top: 'bottom'
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.name.includes('Bonnes')) {
            return `
              <strong>Bonnes évaluations</strong><br/>
              ${this.bonnesEvaluationsTop3 || 'Aucune'}
            `;
          } else {
            return `<br/>
              <strong>Mauvaises évaluations</strong><br/>
              ${this.mauvaisesEvaluationsTop3 || 'Aucune'}
            `;
          }
        }
      },
      color: ['#5e43bb', '#a191db'],
      series: [
        {
          name: 'Évaluation',
          type: 'pie',
          radius: '75%',
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          startAngle: 180,
          endAngle: 0,
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {d}%',
          },
          data: [
            { value: this.bonnesCount, name: 'Bonnes (Avancé/Expert)' },
            { value: this.mauvaisesCount, name: 'Mauvaises (Débutant/Intermédiaire)' }
          ]
        }
      ]
    };
  }

  setLineChartOptions(labels: string[], data: (number | null)[]) {
    this.evaluationTrendChartOptions = {
      title: {
        text: 'Évolution des niveaux d’évaluation',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const val = params[0].value?.toFixed(2);
          const niveaux = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
          const niveauLabel = val ? niveaux[Math.round(val) - 1] : 'Inconnu';
          return `${params[0].axisValue}<br/>Moyenne: ${val} (${niveauLabel})`;
        }
      },
      xAxis: {
        type: 'category',
        data: labels,
        name: 'Mois'
      },
      yAxis: {
        type: 'value',
        min: 1,
        max: 4,
        interval: 1,
        axisLabel: {
          formatter: (value: number) => {
            const niveaux = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
            return niveaux[value - 1];
          }
        },
        name: 'Niveau'
      },
      series: [
        {
          data: data,
          type: 'line',
          smooth: true,
          name: 'Niveau moyen',
          label: {
            show: true,
            formatter: '{c}'
          },
          lineStyle: {
            color: '#5e43bb'
          },
          itemStyle: {
            color: '#5e43bb'
          },
          areaStyle: {
            opacity: 0.1,
            color: '#5e43bb'
          }
        }
      ]
    };
  }

loadAnalyseData() {
  const { startDate, endDate, selectedPostId } = this.dashboardForm.value;

  if (startDate && endDate && selectedPostId) {
    this.analyseService.getAnalyse(startDate, endDate, selectedPostId)
      .subscribe((result) => {
        this.analyseResult = result;
      });
  }
}

exportPDF(): void {
  const element = this.pdfContent.nativeElement;

  // Fixe la largeur pour s'assurer que le contenu tienne dans A4
  element.style.width = '190mm';

  // Forcer le resize/redraw d'echarts
  window.dispatchEvent(new Event('resize'));

  // Attendre 500ms pour que les charts se redessinent
  setTimeout(() => {
    const options = {
      margin: 10,
      filename: 'analyse_export.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save().then(() => {
      element.style.width = ''; // Nettoyage
    });

  }, 500); // délai important pour laisser echarts finir son rendu
}

ngAfterViewInit(): void {
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 100);
}

}