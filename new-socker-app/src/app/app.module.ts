import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentComponent } from './components/document/document.component';
import {DocumentService} from './services/document.service';

// const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    DocumentListComponent,
    DocumentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // SocketIoModule.forRoot(config)
  ],
  providers: [
    DocumentService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
