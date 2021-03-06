import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForumPage } from './forum';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ForumPage,
  ],
  imports: [
    IonicPageModule.forChild(ForumPage),
    ComponentsModule,
    PipesModule
  ],
})
export class ForumPageModule {}
