import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluationService } from '../services/evaluation.service';

@Component({
  selector: 'app-historique-evaluation',
  templateUrl: './historique-evaluation.component.html',
  styleUrls: ['./historique-evaluation.component.scss']
})
export class HistoriqueEvaluationComponent implements OnInit {
  employeeId!: number;
  competenceId!: number;
  history: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.employeeId = +this.route.snapshot.paramMap.get('employeeId')!;
    this.competenceId = +this.route.snapshot.paramMap.get('competenceId')!;

    this.evaluationService.getEvaluationHistory(this.employeeId, this.competenceId)
      .subscribe(data => {
        this.history = data;
        console.log('🕘 Historique:', this.history);
      });
  }
}

