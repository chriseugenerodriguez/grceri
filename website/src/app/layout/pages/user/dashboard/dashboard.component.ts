import { Component, OnInit } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';
import { AuthService } from '../../../../core';

import { ChartType } from 'chart.js';

// COMPONENT
@Component({
  moduleId: module.id,
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
})

// CLASS
export class DashboardComponent implements OnInit {
  profile: any;
  load: boolean;

  constructor(meta: Meta, title: Title, private AS: AuthService) {
    title.setTitle('Find where your groceries are in the market - Grocery Finder');
    if (this.AS.userProfile) {
      this.profile = this.AS.userProfile;
    } else {
      this.AS.getProfile((err, profile) => {
        this.profile = profile;
      });
    }

  }

  ngOnInit() {
  }

  // Doughnut
  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType: ChartType = 'doughnut';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  // lineChart
  public lineChartData: Array<any> = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartType: string = 'line';
  public pieChartType: string = 'pie';
}
