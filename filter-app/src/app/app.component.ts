import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import layers from 'src/assets/layers.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  public lyr;
  public select: any;

  constructor(){
    this.lyr = layers;
    this.select = [];
  }
  public doneLoading = false;

  private ctx!: any; // this.ctx = this.canvas.nativeElement.getContext('2d');

  ngOnInit(): void {
      this.ctx = this.canvas.nativeElement.getContext('2d');  
      this.redraw();
  }

  async redraw() { 
    let imageContainer: HTMLImageElement[] = [];

    for(var i = 0; i < layers.length; ++i) {
      if(this.select[layers[i].name] != undefined){
        if(layers[i].elements[this.select[layers[i].name]] == undefined) {
          this.select[layers[i].name] = 0;
        }
      } else {
        this.select[layers[i].name] = 0;
      }
      let image = new Image();
      let src = layers[i].elements[this.select[layers[i].name]].path;
      image.src = src.replace('C:\\Users\\ihdan\\git\\NFTs\\tricrypta_generative_art_toolchain', '../assets/')
      await image.decode();
      imageContainer.push(image);
      /*image.onload = () => {
        this.ctx.drawImage(image, 0,0,1000, 1000);
      } */
    }

    Object.values(imageContainer).forEach(img => {
      this.ctx.drawImage(img, 0,0,1000,1000);
    })
  }

  selectPrevious(layer): void {
    let v = layers.find(cLayer => cLayer.name == layer); // layer
    if(v != undefined) {
      console.log(v.elements.length);
      if(this.select[layer] != undefined) {
        if(this.select[layer] > 0){ // we won't go back here
          this.select[layer] -= 1;
        } else { // all the way to the back
          this.select[layer] = v.elements.length - 1;
        }  
      } else {
        this.select[layer] = v.elements.length - 1;
      }
    }
    this.redraw();
  }

  selectNext(layer): void {
    if(this.select[layer] != undefined) {
      this.select[layer] += 1;
    } else {
      this.select[layer] = 1;
    }
    this.redraw();
  }

  download(): void {
    
  }
}
