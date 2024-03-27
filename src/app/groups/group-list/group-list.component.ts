import { Component, OnInit } from '@angular/core';
import { GroupService } from '../group.service';
import { ToastrService } from 'ngx-toastr';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { EditGroupComponent } from '../modal/edit-group/edit-group.component';
import { RemoveGroupComponent } from '../modal/remove-group/remove-group.component';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})

export class GroupListComponent implements OnInit {
  groupLoading = true;
  groupTree = [];
  groupFromBack = [];
  groupParents = [];
  // dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener)

  private _transformer = (node, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      rank: node.rank,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<any>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private groupService: GroupService, private toastr: ToastrService, private dialog: MatDialog) { }

  hasChild = (_: number, node) => node.expandable;

  convertGroupToTree(groups) {
    this.groupTree = [];
    this.groupFromBack = groups;
    groups.forEach(group => {
      if (group.parent == 0) {
        this.groupParents.push(group);
        this.groupTree.push({ id: group.id, name: group.name_pl, rank: group.rank, children: [] });
      }
    });
    groups.forEach(group => {
      if (group.parent != 0) {
        // if (this.groupTree.find(x => x.id == group.parent)) {
        this.groupTree.find(x => x.id == group.parent).children.push({ id: group.id, name: group.name_pl, rank: group.rank });
        // }
      }
    });
    this.dataSource.data = this.groupTree;
  }
  ngOnInit(): void {
    this.groupLoading = true;
    this.groupService.groupList().subscribe(groups => {
      this.groupLoading = false;
      this.convertGroupToTree(groups);
    }, err => {
      console.error(err);
      this.groupLoading = false;
      this.toastr.error('Nie udało się pobrać listy grup', 'Błąd');
    });
  }
  addNewGroup() {
    const addGroup = this.dialog.open(EditGroupComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Dodaj nową grupe', groupParents: this.groupParents } });
    addGroup.afterClosed().subscribe(newGroup => {
      if (newGroup) {
        this.groupLoading = true;
        this.groupService.groupAdd(newGroup).subscribe(newGroupList => {
          this.groupLoading = false;
          this.dataSource.data = [];
          this.convertGroupToTree(newGroupList);
          this.toastr.success('Zapisano grupę', 'Success');
        }, err => {
          console.error(err);
          this.groupLoading = false;
          this.toastr.error('Błąd podczas edycji Grupy', 'Error');
        });
      }
    });
  }
  editGroup(id: number) {
    let clickGroup = this.groupFromBack.find(x => x.id == id);
    let hasChildrenGroup = this.groupFromBack.find(x => x.parent == id);
    const EditGroup = this.dialog.open(EditGroupComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Edytuj: ', group: clickGroup, groupParents: this.groupParents, hasParent: hasChildrenGroup } });
    EditGroup.afterClosed().subscribe(newGroup => {
      if (newGroup) {
        if (newGroup == 'remove') {
          this.removeGroup(id);
        } else {
          this.groupLoading = true;
          this.groupService.groupUpdate(clickGroup.id, newGroup).subscribe(newGroupList => {
            this.groupLoading = false;
            this.dataSource.data = [];
            this.convertGroupToTree(newGroupList);
            this.toastr.success('Zapisano grupę', 'Success');
          }, err => {
            console.error(err);
            this.groupLoading = false;
            this.toastr.error('Błąd podczas edycji Grupy', 'Error');
          });
        }
      }
    });
  }
  removeGroup(id) {
    this.groupLoading = true;
    this.groupService.groupRemove(id).subscribe(resp => {
      this.groupLoading = false;
      this.convertGroupToTree(resp);
      this.toastr.success('Usunięto grupę', 'Success');
    }, err => {
      console.error(err);
      this.groupLoading = false;
      this.toastr.error('Błąd podczas usuwania grupy', 'Error');
    });
  }
}


