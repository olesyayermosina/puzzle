import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PuzzleService} from "../../services/puzzle/puzzle.service";

const mockResult = [
  [
    ['A', '0', 'B'], ['D', 'E', 'F'], ['G', 'J', 'I'],
  ],
  [
    ['A', 'T', 'B'], ['D', 'E', 'F'], ['G', 'J', 'I'],
  ],
  [
    ['R', '0', 'B'], ['D', 'E', 'F'], ['G', 'J', 'I'],
  ],
];

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent implements OnInit {
  public areaSizeForm: FormGroup;

  public areaForm: FormGroup;

  public areaSize: number = 5;

  public words: string[] = [];

  public result: any = [];

  constructor(
    private fb: FormBuilder,
    public service: PuzzleService,
  ) {}

  public ngOnInit(): void {
    this.initSizeForm();
    this.initAreaForm();
    this.getSolution();
  }

  public initSizeForm(): void {
    this.areaSizeForm = this.fb.group({
      size: [this.areaSize, Validators.required],
      words: [this.words.join(', '), Validators.required]
    });

    this.areaSizeForm.get('size')?.valueChanges.subscribe((value) => {
      this.areaSize = value;
      if (value >= 3) {
        this.initAreaForm();
      }
    });

    this.areaSizeForm.get('words')?.valueChanges.subscribe((value) => {
      if (value.length) {
        this.words = value.split(', ');
      }
    });
  }

  public initAreaForm(): void {
    this.areaForm = this.fb.group({});
    for (let i = 0; i < this.areaSize; i++) {
      const rowGroup = this.fb.group({});
      for (let j = 0; j < this.areaSize; j++) {
        rowGroup.addControl(j.toString(), new FormControl('', Validators.required));
      }
      this.areaForm.addControl(i.toString(), rowGroup);
    }
  }

  public getRowControls(row: AbstractControl): AbstractControl[] {
    if (row instanceof FormGroup) {
      return Object.values(row.controls);
    }
    return [];
  }

  public getRules(): void {
    this.service.getRules().subscribe(value => {
      this.areaSize = value.grid.length;
      this.areaSizeForm.controls['size'].setValue(value.grid.length);
      this.areaSizeForm.controls['words'].setValue(value.words.join(', '));
      this.words = value.words;
      this.initAreaForm();

      for (let i = 0; i < this.areaSize; i++) {
        for (let j = 0; j < this.areaSize; j++) {
          this.areaForm.get(i.toString())?.get(j.toString())?.setValue(value.grid[i][j]);
        }
      }
    });
  }

  public sendRules(): void {
    if (this.areaForm.valid) {
      const formData: string[][] = [];
      for (let i = 0; i < this.areaSize; i++) {
        const row: string[] = [];
        for (let j = 0; j < this.areaSize; j++) {
          if (this.areaForm.get(i.toString())?.get(j.toString())?.value === '0') {
            row.push('');
          } else {
            row.push(this.areaForm.get(i.toString())?.get(j.toString())?.value);
          }
        }
        formData.push(row);
      }
      this.service.sendRules(formData, this.words).subscribe();
    }
  }

  public getSolution(): void {
    this.service.getSolution().subscribe(solution => {
      this.result = solution;
    });
  }
}
