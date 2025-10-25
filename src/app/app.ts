import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormularioContable } from './formulario-contable/formulario-contable';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormularioContable],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('app-contable');
}
