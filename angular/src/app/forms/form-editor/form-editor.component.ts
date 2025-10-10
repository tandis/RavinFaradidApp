import { Component, OnInit } from '@angular/core';
import { LocalizationPipe } from '@abp/ng.core';
import { SurveyCreatorModel, editorLocalization,settings,registerSurveyTheme } from "survey-creator-core";
import { FormService } from '@proxy/forms/application';
import { CreateUpdateFormDto } from '@proxy/forms/application/contracts/dtos';

import "survey-creator-core/i18n/persian";
import { SurveyCreatorModule } from 'survey-creator-angular';
import SurveyTheme from "survey-core/themes";
import { Serializer } from 'survey-core';
import { FormDto } from 'src/app/shared/dto/form.dto';

editorLocalization.currentLocale = "fa";

//editorLocalization.locales["fa"].qt["persiancalendar"] = "تقویم شمسی";

registerSurveyTheme(SurveyTheme);
const creatorOptions = {
  showLogicTab: true,
  isAutoSave: false,
  showJSONEditorTab:true,
  showThemeTab:true,
  isRTL:true
};

Serializer.addProperty("question", {
  name: "score:number"
});

@Component({
  selector: 'app-form-editor',
  imports: [SurveyCreatorModule],
  templateUrl: './form-editor.component.html',
  styleUrl: './form-editor.component.scss'
})


export class FormEditorComponent implements OnInit{
 creator: SurveyCreatorModel;
 form:CreateUpdateFormDto;
 saving = false;
  constructor(private formService: FormService) {}

  ngOnInit(): void {
     localStorage.setItem("ExistSurveyId","");
    this.creator = new SurveyCreatorModel(creatorOptions);
    //this.creator.text = JSON.stringify(defaultJson);
    this.creator.toolbox.forceCompact = false;

    this.creator.showPropertyGrid = false;
    this.creator.saveSurveyFunc = (saveNo: number, callback: Function) => {
      console.log(saveNo, true, this.creator.JSON);
      callback(saveNo, true);
      this.saving = true;
      // this.form({
      //   surveyName: this.creator.JSON.title,
      //   isActive: true,
      //   JSONContent:JSON.stringify(this.creator.JSON)
      // })
      if(this.isEmpty(localStorage.getItem("ExistSurveyId"))){}

  }
}
ngAfterViewInit(): void {
  // window.addEventListener('resize', () => {
  //   this.creator?.render();
  // });
}

  // saveForm() {
  //   const json = JSON.stringify(this.creator.JSON);
  //   const form = {
  //     title: this.creator.JSON.title || 'Untitled Form',
  //     description: this.creator.JSON.description || '',
  //     jsonDefinition: json
  //   };
  //   this.formService.create(form).subscribe(() => alert('Form saved!'));
  // }
  isEmpty(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0;
  }
}
