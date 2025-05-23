import { Component, OnInit } from '@angular/core';
import { DashbordService } from '../services/dashbord.service';
import { StatusShareService } from '../services/status-share.service';
import { EmployeeStatusService } from '../services/employee-status.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalEmployees = 0;
  totalEvaluations = 0;
  totalCompetences = 0;
  totalPostes = 0;
  bonnesCount = 0;
mauvaisesCount = 0;
evaluationQualityChartOptions: any;
evaluationTrendChartOptions:any;
bonnesEvaluationsTop3 = '';
mauvaisesEvaluationsTop3 = '';

  redCount = 0;
  orangeCount = 0;
  greenCount = 0;

  statusChartOptions: any;

  constructor(
    private dashService: DashbordService,
    private statusShareService: StatusShareService,
    private employeeStatusService: EmployeeStatusService 
  ) {}

  ngOnInit(): void {
    this.loadDashboardCounts();
   
    
this.loadEmployeeStatusCounts();


  this.dashService.getallEvaluations().subscribe(evaluations => {
  const niveaux = ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'EXPERT'];
  const niveauIndex = (niveau: string) => niveaux.indexOf(niveau);

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

  // 👉 Ces totaux sont pour le graphique
  let bonnes = 0;
  let mauvaises = 0;
  console.log('Nombre total d’évaluations uniques (par compétence):', bestEvaluationsMap.size);
  for (const evaluation of bestEvaluationsMap.values()) {
   
    if (['AVANCE', 'EXPERT'].includes(evaluation.niveau)) {
      bonnes++;
    } else {
      mauvaises++;
    }
  }

  this.bonnesCount = bonnes;
  this.mauvaisesCount = mauvaises;

  // 👉 Ces listes sont juste pour l’affichage des top 3
  const bonnesTop3List = Array.from(bestEvaluationsMap.values())
    .filter(e => ['AVANCE', 'EXPERT'].includes(e.niveau))
    .sort((a, b) => niveauIndex(b.niveau) - niveauIndex(a.niveau))
    .slice(0, 3)
    .map(e => `${e.competence?.code || 'N/A'} (${e.niveau})`);

  const mauvaisesTop3List = Array.from(bestEvaluationsMap.values())
    .filter(e => ['DEBUTANT', 'INTERMEDIAIRE'].includes(e.niveau))
    .sort((a, b) => niveauIndex(a.niveau) - niveauIndex(b.niveau))
    .slice(0, 3)
    .map(e => `${e.competence?.code || 'N/A'} (${e.niveau})`);

  this.bonnesEvaluationsTop3 = bonnesTop3List.join('<br/>');
  this.mauvaisesEvaluationsTop3 = mauvaisesTop3List.join('<br/>');

  // 👇 met à jour le graphique
  this.setEvaluationQualityChart();
});


this.dashService.getallEvaluations().subscribe(evaluations => {
  const niveaux = ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'EXPERT'];
  const niveauToValue = (niveau: string) => niveaux.indexOf(niveau) + 1; // DEBUTANT = 1, ..., EXPERT = 4

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  // Préparer une structure pour les mois
  const monthLabels: string[] = [];
  const monthlySums: { [key: string]: number[] } = {};

  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = date.toLocaleString('default', { month: 'short' });
    monthLabels.unshift(label); // Ajout au début
    monthlySums[label] = [];
  }

  // Grouper les évaluations par mois
  evaluations.forEach(evaluation => {
    const date = new Date(evaluation.date);
    if (date >= sixMonthsAgo) {
      const label = date.toLocaleString('default', { month: 'short' });
      if (monthlySums[label]) {
        monthlySums[label].push(niveauToValue(evaluation.niveau));
      }
    }
  });

  // Calculer la moyenne
  const moyenneParMois: number[] = monthLabels.map(label => {
    const values = monthlySums[label];
    if (values.length === 0) return null;
    const sum = values.reduce((a, b) => a + b, 0);
    return +(sum / values.length).toFixed(2);
  });

  // Appel au graphique
  this.setLineChartOptions(monthLabels, moyenneParMois);
});


  }

  loadDashboardCounts(): void {
    this.dashService.getEmployees().subscribe(data => {
      this.totalEmployees = data.length;
    });

    this.dashService.getallEvaluations().subscribe(data => {
      this.totalEvaluations = data.length;
    });

    this.dashService.getAllCompetences().subscribe(data => {
      this.totalCompetences = data.length;
    });

    this.dashService.getallPosts().subscribe(data => {
      this.totalPostes = data.length;
    });
  }

 loadEmployeeStatusCounts(): void {
  this.dashService.getEmployees().subscribe(async employees => {
    let red = 0;
    let orange = 0;
    let green = 0;

    for (const employee of employees) {
      const status = await this.employeeStatusService.getEmployeeStatus(employee.id);
      if (status === 'rouge') red++;
      else if (status === 'orange') orange++;
      else if (status === 'vert') green++;
    }

    this.redCount = red;
    this.orangeCount = orange;
    this.greenCount = green;

    this.setChartOptions(); // 🧠 met à jour le donut chart
  });
}

  setChartOptions(): void {
    this.statusChartOptions = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      color: ['#f44336', '#ff9800', '#4caf50'], // Rouge, Orange, Vert
      series: [
        {
          name: 'Répartition des statuts',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: this.redCount, name: 'Employés non evalué' },
            { value: this.orangeCount, name: 'Employés avec ecart' },
            { value: this.greenCount, name: 'Employés bien evalué' }
          ]
        }
      ]
    };
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



}