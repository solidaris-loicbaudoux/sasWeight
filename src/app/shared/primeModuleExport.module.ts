import { NgModule } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { definePreset } from '@primeuix/themes';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { ListboxModule } from 'primeng/listbox';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { TabsModule } from 'primeng/tabs';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputMaskModule } from 'primeng/inputmask';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ChartModule } from 'primeng/chart';

//const iCas = definePreset(Aura, PlectrumTokens);
const iCas = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
  },
});

@NgModule({
  declarations: [],
  imports: [
    //primeNG modules
    ButtonModule,
    InputTextModule,
    ToastModule,
    ProgressSpinnerModule,
    CardModule,
    FieldsetModule,
    ListboxModule,
    ToggleSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    DatePickerModule,
    TabsModule,
    SelectModule,
    MessageModule,
    DividerModule,
    DialogModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    TableModule,
    TagModule,
    BadgeModule,
    TooltipModule,
    ToggleButtonModule,
    InputMaskModule,
    IconFieldModule,
    InputIconModule,
    ChartModule,
  ],
  providers: [
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark',
        },
      },
      translation: {
        firstDayOfWeek: 1,
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        monthNamesShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        today: "Aujourd'hui",
        clear: 'Effacer',
        weekHeader: 'Sem',
        dateFormat: 'dd/mm/yy',
      },
    }),
    MessageService,
    ConfirmationService,
  ],
  exports: [
    ButtonModule,
    InputTextModule,
    ToastModule,
    ProgressSpinnerModule,
    CardModule,
    FieldsetModule,
    ListboxModule,
    ToggleSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    DatePickerModule,
    TabsModule,
    SelectModule,
    MessageModule,
    DividerModule,
    DialogModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    TableModule,
    TagModule,
    BadgeModule,
    TooltipModule,
    ToggleButtonModule,
    InputMaskModule,
    IconFieldModule,
    InputIconModule,
    ChartModule,
  ],
})
export class PrimeExportModule {}
