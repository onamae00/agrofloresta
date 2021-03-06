import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuidePage } from './guide';
import { QuillModule } from 'ngx-quill'
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';


@NgModule({
  declarations: [
    GuidePage,
  ],
  imports: [
    IonicPageModule.forChild(GuidePage),
    QuillModule,
    PipesModule,
    ComponentsModule,
    DirectivesModule
  ]
})
export class GuidePageModule {}
