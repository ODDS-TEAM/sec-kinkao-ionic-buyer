import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodPageRoutingModule } from './food-routing.module';

import { FoodPage } from './food.page';
import { OptionsPageModule } from './options/options.module';
import { BasketPageModule } from './basket/basket.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodPageRoutingModule,
    OptionsPageModule,
    BasketPageModule,
  ],
  declarations: [FoodPage]
})
export class FoodPageModule {}
