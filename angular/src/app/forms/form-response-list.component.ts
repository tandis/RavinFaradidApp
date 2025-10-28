import {
  AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild
} from '@angular/core';
import { Tabulator } from 'survey-analytics/survey.analytics.tabulator';
import * as SurveyAnalyticsTabulator from 'survey-analytics/survey.analytics.tabulator';
import { FormService, FormResponseService } from '@proxy/forms/application/index'
import { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Dialog } from '@angular/cdk/dialog';
import { Model, surveyLocalization } from 'survey-core';
import { LocalizationPipe } from '@abp/ng.core';
import { NgbModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import "survey-core/i18n";
//surveyLocalization.defaultLocale = "fa";
//import { ResponseViewerDialogComponent } from './response-viewer-dialog.component';
declare var tippy: any;
@Component({
  selector: 'app-survey-results-table',
  templateUrl: './form-response-list.component.html',
  styleUrls: ['./form-response-list.component.scss'],
  standalone: true,
  imports: [NgbDropdownModule]
})
export class FormResponseListComponent implements AfterViewInit, OnDestroy {
  formId!: string;
  surveyModel: Model;
  private table!: Tabulator;
  search = '';
  pageSize = 10;
  pageIndex = 0;
  sorting = 'creationTime DESC';
  constructor(
    private _responses: FormResponseService,
    private _forms: FormService,
    private dialog: Dialog,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.formId = this.route.snapshot.paramMap.get('id')!;
  }

  async ngAfterViewInit() {
    const v = await this._forms.getPublishedVersion(this.formId).toPromise();
    const input: PagedAndSortedResultRequestDto = {
      skipCount: this.pageIndex * this.pageSize,
      maxResultCount: this.pageSize,
      sorting: this.sorting,
    };
    const res = await this._responses.getList(input).toPromise();
    console.log(v, res)

    let jsonObject = JSON.parse(v.jsonDefinition);

    jsonObject.pages[0].elements.push({ type: 'text', name: 'totalScore', visible: false, title: 'امتیاز دریافتی' })
    jsonObject.pages[0].elements.push({ type: "text", name: "maxScore", visible: false, title: "کل امتیاز" })
    jsonObject.pages[0].elements.push({ type: "html", name: "resultId", visible: false, title: "شماره" }) // بهتر است این ستون مخفی باشد و فقط در دیتا وجود داشته باشد

    let survey = new Model(JSON.stringify(jsonObject));

    survey.pages[0].addNewQuestion("text","عملیات",0)
    survey.mergeData({
      "عملیات":"ویرایش"
    })

    const surveyR = res.items;
    const data = [];
    for (const r of surveyR) {
      const resultData = JSON.parse(r.responseData);
      resultData.resultId = `<a href=''>r.id</a>`;
      data.push(resultData)
    }

    console.log({data})

    const surveyTable = new Tabulator(survey, data, {
      locale: "fa",
      downloadButtons: ["xlsx", "pdf"],
      selectableRange:1,
    });

    surveyTable.render("surveyDataTable");

    const t = (surveyTable as any).tabulatorTables as any;

    SurveyAnalyticsTabulator.TableExtensions.registerExtension({
      location: "details",
      name: "customActionAddRow",
      visibleIndex: 0,
      render: (table: any, opt: any) => {
        const btn = t.DocumentHelper.createElement(
          "button",
          "sa-table__btn sa-table__btn--small",
          {
            innerHTML: "Add Row",
            onclick: (e: MouseEvent) => {
              e.stopPropagation();
              console.log(opt.row.getDataPosition())
             //this.addRow(opt.row.getDataPosition());
            },
          }
        );
        return btn;
      },
    });
     t.addColumn({
      title: '', width: 60, hozAlign: 'center', headerSort: false, frozen: true,
      formatter: (cell: any) => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-sm btn-outline-primary';
        btn.textContent = 'ویرایش';
        return btn;
      },
      cellClick: (_e: any, cell: any) => {
        const row = cell.getRow();                      // Tabulator RowComponent
        const rowData = row.getData();                  // JSON پاسخ
        //this.openEditModal(rowData);                    // ↓ پیاده‌سازی در بخش 4
        console.log(rowData)
      }
    }, true, 'edit'); // true=prepend
  }

  ngOnDestroy(): void { }

  reload() { }

  private createTableFromJSON(data: any[], questions: any[]): string {
    if (!Array.isArray(data) || data.length === 0) {
      return '<div class="p-2 text-gray-500">داده‌ای برای نمایش وجود ندارد.</div>';
    }

    let headers = questions.map(q => `<th scope="col" class="px-4 py-2">${q.title || q.name}</th>`).join('');

    let table = '<table class="w-full text-sm text-right text-gray-700">';
    table += `<thead class="text-xs text-gray-800 uppercase bg-gray-100"><tr>${headers}</tr></thead><tbody>`;

    data.forEach(item => {
      table += `<tr class="bg-white border-b hover:bg-gray-50">`;
      questions.forEach(q => {
        table += `<td class="px-4 py-2">${item[q.name] || "-"}</td>`;
      });
      table += `</tr>`;
    });

    table += '</tbody></table>';
    return table;
  }

}
