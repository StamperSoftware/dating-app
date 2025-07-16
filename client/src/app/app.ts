import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./ui/header/header";
import { Footer } from "./ui/footer/footer";
import { ConfirmDialog } from "./ui/confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, Header, Footer, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
