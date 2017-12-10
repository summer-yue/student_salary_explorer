import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'college_info',
  template: `
    <div class="college_info">
        <div class="header">College Information</div>
     
        <div class="name">"UPenn"</div>
        <div class="separateName"></div>
        <div class="description">Description filler</div>
    </div>
  `,
  styleUrls: ['./college_info.component.css']
})

export class CollegeInfoComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
