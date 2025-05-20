

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashbordService } from '../services/dashbord.service';

interface Employee {
  id: number;
  nom: string;
  prenom: string;
  post: {
    id: number;
    [key: string]: any;
  };
  [key: string]: any;
}

interface Evaluation {
  competence: {
    id: number;
    [key: string]: any;
  };
  niveau: string;
  [key: string]: any;
}

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {

  employeeId!: number;
  employee: any;
  competenceCount: number = 0;
  lineChartData: any;
  pieChartData: any;
  niveauChartData: any;
  ecartsCount: number = 0;
  competenceHistories: {
  [competenceId: number]: {
    name: string;
    history: { date: string; niveau: string }[];
  }
} = {};


  // Ordre des niveaux pour comparer
  private niveauOrder = ["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT"];
  evaluations: any[];

  constructor(
    private dashboardService: DashbordService,
    private route: ActivatedRoute
  ) {}
ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
      this.ecartsCount = +params['ecarts'] || 0;
      console.log('Nombre d’écarts reçus:', this.ecartsCount);
    });
  // 1. Récupérer l'ID de l'employé depuis l'URL
  this.employeeId = +this.route.snapshot.paramMap.get('id')!;

  // 2. Récupérer les détails de l'employé
  this.dashboardService.getEmployeeById(this.employeeId).subscribe((data: any) => {
    this.employee = data;

    const postId = this.employee?.post?.id;

    if (postId) {
  
      // 3. Récupérer les compétences liées au poste
      this.dashboardService.getCompetencesByPostId(postId).subscribe((competences: any[]) => {
        // 4. Récupérer les évaluations de l'employé
        this.dashboardService.getEvaluationsByEmployeeId(this.employeeId).subscribe((evaluations: any[]) => {
           this.evaluations = evaluations;
          console.log('Compétences du poste :', competences);
          console.log('Évaluations brutes de l\'employé :', evaluations);

          // Garde la meilleure évaluation par compétence selon le niveau
          const bestEvaluations = this.getBestEvaluationsByCompetence(evaluations);

          this.enrichEvaluationsWithCompetenceCodes(bestEvaluations).then((enrichedEvaluations) => {
            const filteredEvaluations = enrichedEvaluations.filter(ev => this.isAboveIntermediaire(ev.niveau));

            const completed = filteredEvaluations.length;
            const total = competences.length;
            const pending = total - completed;

            this.competenceCount = total;

            const completedCodes = filteredEvaluations.map(ev => ev.competenceCode);
            const pendingCodes = competences
              .map(c => c.code)
              .filter(code => !completedCodes.includes(code));

            this.pieChartData = this.buildPieChart(completed, pending, completedCodes, pendingCodes);
            this.niveauChartData = this.buildPieChartFromNiveaux(enrichedEvaluations);
           this.buildLineChart();
          });

        });
      });
    } else {
      console.warn("Poste non défini pour l'employé");
    }
  });
  
}

  // Fonction pour garder la meilleure évaluation par compétence
private getBestEvaluationsByCompetence(evaluations: any[]): any[] {
  const bestMap = new Map<number, any>();

  evaluations.forEach(ev => {
    // Adaptation selon ta structure
    const compId = ev.competenceId ?? ev.competence?.id;
    if (!compId) return;

    if (!bestMap.has(compId)) {
      bestMap.set(compId, ev);
    } else {
      const currentBest = bestMap.get(compId);
      if (this.niveauOrder.indexOf(ev.niveau) > this.niveauOrder.indexOf(currentBest.niveau)) {
        bestMap.set(compId, ev);
      }
    }
  });

  return Array.from(bestMap.values());
}

  isAboveIntermediaire(niveau: string): boolean {
    return this.niveauOrder.indexOf(niveau) > this.niveauOrder.indexOf("INTERMEDIAIRE");
  }

 buildPieChart(completed: number, pending: number, completedCodes: string[] = [], pendingCodes: string[] = []): any {
  const total = completed + pending;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const codes = params.data.competenceCodes || [];
        const codeList = codes.length ? codes.map(c => `• ${c}`).join('<br/>') : 'Aucun code';
        return `${params.name}<br/>Nombre: ${params.value}<br/>Codes:<br/>${codeList}`;
      }
    },
    legend: {
      show: true,
      bottom: 0,
    },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: `${percentage}%`,
        fontSize: 18,
        color: '#212121'
      },
      labelLine: { show: false },
      data: [
        {
          value: completed,
          name: 'Completed',
          itemStyle: { color: '#663399' },
          competenceCodes: completedCodes
        },
        {
          value: pending,
          name: 'Pending',
          itemStyle: { color: '#ced4da' },
          competenceCodes: pendingCodes
        }
      ]
    }]
  };
}
buildPieChartFromNiveaux(evaluations: any[]): any {
  const niveauCounts: { [key: string]: number } = {
    DEBUTANT: 0,
    INTERMEDIAIRE: 0,
    AVANCE: 0,
    EXPERT: 0
  };

  const competenceCodesByNiveau: { [key: string]: string[] } = {
    DEBUTANT: [],
    INTERMEDIAIRE: [],
    AVANCE: [],
    EXPERT: []
  };

  evaluations.forEach(ev => {
    const niveau = ev.niveau;
    const code = ev.competenceCode || ev.competence?.code || 'Inconnu';

    if (niveauCounts[niveau] !== undefined) {
      niveauCounts[niveau]++;
      competenceCodesByNiveau[niveau].push(code);
    }
  });

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const codes = params.data.competenceCodes || [];
        const codeList = codes.length ? codes.map(c => `• ${c}`).join('<br/>') : 'Aucun code';
        return `${params.name}<br/>Nombre: ${params.value}<br/>Codes: ${codeList}`;
      }
    },
    legend: {
      bottom: 0
    },
    series: [
      {
        name: 'Niveau atteint',
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: '{b}: {c} ({d}%)',
          color: '#212121'
        },
        labelLine: {
          show: true
        },
        data: Object.keys(niveauCounts).map(niveau => ({
          value: niveauCounts[niveau],
          name: niveau,
          competenceCodes: competenceCodesByNiveau[niveau],
          itemStyle: {
            color: this.getColorForNiveau(niveau)
          }
        }))
      }
    ]
  };
}

getColorForNiveau(niveau: string): string {
  switch (niveau) {
    case 'DEBUTANT': return '#a191db';      // Lightest purple
    case 'INTERMEDIAIRE': return '#8b77d1'; // Slightly darker
    case 'AVANCE': return '#755dc6';        // Medium purple
    case 'EXPERT': return '#5e43bb';        // Dark purple
    default: return '#b3a1e6';              // Default fallback purple
  }
}

private enrichEvaluationsWithCompetenceCodes(evaluations: any[]): Promise<any[]> {
  const promises = evaluations.map(async (ev) => {
    const competenceId = ev.competence?.id ?? ev.competenceId;
    if (competenceId) {
      try {
        const competence: any = await this.dashboardService.getCompetenceById(competenceId).toPromise();
        ev.competenceCode = competence.code;
      } catch (error) {
        console.error(`Erreur lors du chargement de la compétence ${competenceId}`, error);
        ev.competenceCode = 'Inconnu';
      }
    } else {
      ev.competenceCode = 'Inconnu';
    }
    return ev;
  });

  return Promise.all(promises);
}




buildLineChart(): void {
  const lastSixMonths = this.getLastSixMonths();
  const evaluationsByMonth: { [month: string]: number[] } = {};

  // Initialiser les mois
  lastSixMonths.forEach(month => evaluationsByMonth[month] = []);

  // Regrouper les niveaux par mois
  this.evaluations.forEach(ev => {
    const date = new Date(ev.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (evaluationsByMonth[monthKey]) {
      evaluationsByMonth[monthKey].push(this.niveauToNumeric(ev.niveau));
    }
  });

  // Construire les moyennes
let lastKnownAverage = 0;

const chartData = lastSixMonths.map(month => {
  const levels = evaluationsByMonth[month];
  let avg = lastKnownAverage;

  if (levels.length) {
    avg = levels.reduce((a, b) => a + b, 0) / levels.length;
    lastKnownAverage = avg;
  }

  return { month, average: avg };
});

  // Injecter dans ECharts
  this.lineChartData = {
    xAxis: {
      type: 'category',
      data: chartData.map(d => d.month)
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: 4,
      interval: 1,
      axisLabel: {
        formatter: (value: number) => this.numericToNiveau(value)
      }
    },
    series: [{
      data: chartData.map(d => d.average),
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#5e43bb'
      }
    }],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const val = params[0].value.toFixed(2);
        return `${params[0].axisValue}<br/>Moyenne: ${val} (${this.numericToNiveau(val)})`;
      }
    }
  };
}

getLastSixMonths(): string[] {
  const result: string[] = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    result.push(month);
  }
  return result;
}




private niveauToNumeric(niveau: string): number {
  switch (niveau) {
    case 'DEBUTANT': return 1;
    case 'INTERMEDIAIRE': return 2;
    case 'AVANCE': return 3;
    case 'EXPERT': return 4;
    default: return 0;
  }
}

private numericToNiveau(value: number): string {
  if (value < 1.5) return 'DEBUTANT';
  if (value < 2.5) return 'INTERMEDIAIRE';
  if (value < 3.5) return 'AVANCE';
  return 'EXPERT';
}











}