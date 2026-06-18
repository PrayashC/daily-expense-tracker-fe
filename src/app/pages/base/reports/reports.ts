import { Component, inject, signal, computed, effect } from '@angular/core';
import { ExpenseService } from '../../../services/expense-service';
import { SpendReport, DailyTotal } from '../../../models/spend-report.model';
import { CurrencyPipe } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

type RangeOption = '7d' | '30d' | '3m' | '12m' | '5y';

@Component({
  selector: 'app-reports',
  imports: [NgxEchartsDirective, CurrencyPipe],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {
  private readonly expenseService = inject(ExpenseService);

  readonly rangeLabels: Record<RangeOption, string> = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '3m': 'Last 3 Months',
    '12m': 'Last 12 Months',
    '5y': 'Last 5 Years',
  };

  selectedRange = signal<RangeOption>('7d');
  spendReport = signal<SpendReport | null>(null);

  constructor() {
    effect(() => {
      this.loadSpendReport(this.selectedRange());
    });
  }

  onRangeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as RangeOption;
    this.selectedRange.set(value);
  }

  private loadSpendReport(range: RangeOption): void {
    const { startDate, endDate } = this.getDateRange(range);
    this.expenseService.getSpendReport(startDate, endDate).subscribe({
      next: (report) => this.spendReport.set(report),
      error: () => this.spendReport.set(null),
    });
  }

  private getDateRange(range: RangeOption): { startDate: string; endDate: string } {
    const now = new Date();
    const endDate = this.formatDate(now);
    let startDate: string;

    switch (range) {
      case '7d': {
        const start = new Date(now);
        start.setDate(start.getDate() - 6);
        startDate = this.formatDate(start);
        break;
      }
      case '30d': {
        const start = new Date(now);
        start.setDate(start.getDate() - 29);
        startDate = this.formatDate(start);
        break;
      }
      case '3m': {
        const start = new Date(now);
        start.setMonth(start.getMonth() - 2);
        start.setDate(1);
        startDate = this.formatDate(start);
        break;
      }
      case '12m': {
        const start = new Date(now);
        start.setMonth(start.getMonth() - 11);
        start.setDate(1);
        startDate = this.formatDate(start);
        break;
      }
      case '5y': {
        const start = new Date(now);
        start.setFullYear(start.getFullYear() - 4);
        start.setMonth(0);
        start.setDate(1);
        startDate = this.formatDate(start);
        break;
      }
      default:
        startDate = this.formatDate(new Date(now.setDate(now.getDate() - 6)));
    }

    return { startDate, endDate };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatLabel(dateStr: string): string {
    const range = this.selectedRange();
    const date = new Date(dateStr);

    if (range === '7d' || range === '30d') {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}`;
    }
    if (range === '3m' || range === '12m') {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    return `${date.getFullYear()}`;
  }

  /**
   * Generates all expected date keys for the selected range in YYYY-MM-DD format.
   */
  private generateExpectedDateKeys(startDate: string, endDate: string): string[] {
    const keys: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      keys.push(this.formatDate(current));
      current.setDate(current.getDate() + 1);
    }

    return keys;
  }

  readonly summaryCards = computed(() => {
    const report = this.spendReport();
    if (!report) {
      return [];
    }
    return [
      { label: 'Total', value: report.completeTotal, color: 'text-gray-800' },
      { label: 'Average', value: report.average, color: 'text-gray-800' },
      { label: 'Highest', value: report.highestValue, color: 'text-red-600' },
      { label: 'Lowest', value: report.lowestValue, color: 'text-green-700' },
    ];
  });

  readonly chartOptions = computed<EChartsOption>(() => {
    const report = this.spendReport();
    const dailyTotals: DailyTotal[] = report?.dailyTotals ?? [];
    const range = this.selectedRange();

    // Build a lookup map from the API data: dateKey -> total
    const totalsByDate = new Map<string, number>();
    for (const d of dailyTotals) {
      totalsByDate.set(d.date, d.total);
    }

    // Generate all expected date keys for the selected range
    const { startDate, endDate } = this.getDateRange(range);
    const expectedDateKeys = this.generateExpectedDateKeys(startDate, endDate);

    // Fill in labels and values, using 0 for any missing date
    const labels = expectedDateKeys.map((key) => this.formatLabel(key));
    const values = expectedDateKeys.map((key) => totalsByDate.get(key) ?? 0);

    // Show roughly 10-15 evenly spaced labels regardless of range length.
    const labelCount = labels.length;
    const axisLabelInterval = labelCount <= 14 ? 0 : Math.ceil(labelCount / 12);

    let xAxisName: string;
    if (range === '7d' || range === '30d') {
      xAxisName = 'Date';
    } else if (range === '3m' || range === '12m') {
      xAxisName = 'Month';
    } else {
      xAxisName = 'Year';
    }

    return {
      tooltip: {
        trigger: 'axis' as const,
        valueFormatter: (value: any) =>
          `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value))}`,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category' as const,
        data: labels,
        name: xAxisName,
        nameLocation: 'center' as const,
        nameGap: 30,
        nameMoveOverlap: true,
        axisLabel: {
          interval: axisLabelInterval,
          hideOverlap: true,
          rotate: labels.length > 10 ? 45 : 0,
          fontSize: 11,
        },
      },
      yAxis: {
        type: 'value' as const,
        name: 'Total Spent (₹)',
        axisLabel: {
          formatter: (value: number) =>
            `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)}`,
        },
      },
      series: [
        {
          data: values,
          type: 'line' as const,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#EAB308',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(234, 179, 8, 0.4)' },
              { offset: 1, color: 'rgba(234, 179, 8, 0.02)' },
            ]),
          },
          itemStyle: {
            color: '#EAB308',
          },
        },
      ],
    };
  });
}
