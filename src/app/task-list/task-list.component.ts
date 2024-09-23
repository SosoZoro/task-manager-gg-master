import { Component } from '@angular/core';
import { Task } from '../models/task.model';
import { Router } from '@angular/router';
import { TaskAPI } from '../models/task-api.model';
import { TaskApiService } from '../services/task-api.service';
import { WebSocketService } from '../services/websocket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  tasks: Task[] = [];
  isMobile: boolean;
  showCreatedBy: boolean;
  showAssignedTo: boolean;

  createdTasks: TaskAPI[] = [];
  assignedTasks: TaskAPI[] = [];
  lastUidAssigned = "";

  constructor(
    private taskApiService: TaskApiService,
    private router: Router,
    private webSocketService: WebSocketService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ){
    this.isMobile = Capacitor.isNativePlatform();
    this.showCreatedBy = true;
    this.showAssignedTo = false;

    this.fetchTasks();

    this.webSocketService.getMessage().subscribe(
      (message: any) => {
        if(message.event === "taskCreated"){
          this.fetchTasks();
          
          if(message.assignedToUid === this.authService.getId()){
            this.snackBar.open("New Task assigned To you!", "OK", {
              duration: 5000,
            });
            this.lastUidAssigned = message.taskUid;
          }
        }
    });
  }

  fetchTasks(){
    const userId = this.authService.getId();
    if (userId) {
      this.taskApiService.getTasksCreatedBy(userId).subscribe(
        (res) => {
          this.createdTasks = res.allTasks;
          console.log('Created tasks:', this.createdTasks);
        },
        (error) => {
          console.error('Error fetching created tasks:', error);
          this.snackBar.open("Failed to load created tasks", "OK", { duration: 3000 });
        }
      );

      this.taskApiService.getTasksAssignedTo(userId).subscribe(
        (res) => {
          this.assignedTasks = res.allTasks;
          console.log('Assigned tasks:', this.assignedTasks);
        },
        (error) => {
          console.error('Error fetching assigned tasks:', error);
          this.snackBar.open("Failed to load assigned tasks", "OK", { duration: 3000 });
        }
      );
    } else {
      console.error('No user ID found');
      this.snackBar.open("User not authenticated", "OK", { duration: 3000 });
    }
  }

  changeStatus(task: TaskAPI){
    this.taskApiService.updateTaskStatus(task.taskUid, !task.done).subscribe(
      () => {
        this.fetchTasks();
      },
      (error) => {
        console.error('Error updating task status:', error);
        this.snackBar.open("Failed to update task status", "OK", { duration: 3000 });
      }
    );
  }

  deleteTask(task: TaskAPI){
    this.taskApiService.deleteTask(task.taskUid).subscribe(
      ()=>{
        this.fetchTasks();
      },
      (error) => {
        console.error('Error deleting task:', error);
        this.snackBar.open("Failed to delete task", "OK", { duration: 3000 });
      }
    );
  }

  goToDetail(task: Task){
    this.router.navigate(['/task', task.id])
  }

  shouldHighlight(taskUid: string){
    if(taskUid === this.lastUidAssigned){
      this.lastUidAssigned = "";
      return true;
    }
    return false;
  }

  shouldShowCreatedBy(){
    this.showCreatedBy = true;
    this.showAssignedTo = false;
  }

  shouldShowAssingedTo(){
    this.showCreatedBy = false;
    this.showAssignedTo = true;
  }
}