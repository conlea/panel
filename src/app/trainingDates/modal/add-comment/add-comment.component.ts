import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as customBuildPlaceholders from "../../../../assets/ck-editor-placeholders/ckeditor";

@Component({
  selector: "app-add-comment",
  templateUrl: "./add-comment.component.html",
  styleUrls: ["./add-comment.component.scss"],
})
export class AddCommentComponent implements OnInit {
  public Editor = customBuildPlaceholders;
  public config = {
    placeholder: "Treść notatki",
  };
  comment = "";
  editComment: any = {};
  constructor(
    public dialogEvent: MatDialogRef<AddCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.comment) {
      this.editComment = this.data.comment;
      this.comment = this.editComment.comment;
    }
  }
  saveComment() {
    if (this.data.comment) {
      this.editComment.comment = this.comment;
      this.dialogEvent.close(this.editComment);
    } else {
      let dataToSave = {
        active: 1,
        trainingDate_id: this.data.trainingDate.id,
        comment: this.comment,
      };
      this.dialogEvent.close(dataToSave);
    }
  }
  exitDialog() {
    this.dialogEvent.close();
  }
}
