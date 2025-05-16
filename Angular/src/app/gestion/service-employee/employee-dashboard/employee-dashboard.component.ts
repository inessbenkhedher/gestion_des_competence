

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
  pieChartData: any;

  // Ordre des niveaux pour comparer
  private niveauOrder = ["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT"];

  constructor(
    private dashboardService: DashbordService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
            console.log('Compétences du poste :', competences);
            console.log('Évaluations brutes de l\'employé :', evaluations);

            // Garde la meilleure évaluation par compétence selon le niveau
            const bestEvaluations = this.getBestEvaluationsByCompetence(evaluations);

            // Filtrer celles au-dessus de INTERMEDIAIRE
            const filteredEvaluations = bestEvaluations.filter(ev => this.isAboveIntermediaire(ev.niveau));

            const completed = filteredEvaluations.length;
            const total = competences.length;
            const pending = total - completed;

            this.competenceCount = total;
            console.log('Meilleures évaluations par compétence :', bestEvaluations);
            console.log('Completed:', completed);
            console.log('Pending:', pending);
            console.log('Total compétences:', total);

            this.pieChartData = this.buildPieChart(completed, pending);
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

  buildPieChart(completed: number, pending: number): any {
    const total = completed + pending;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
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
            itemStyle: { color: '#663399' }
          },
          {
            value: pending,
            name: 'Pending',
            itemStyle: { color: '#ced4da' }
          }
        ]
      }]
    };
  }
}