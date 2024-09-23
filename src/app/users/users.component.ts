import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { TaskApiService } from '../services/task-api.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Platform, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  selectedUser: string = '';
  createdTasks: any[] = [];
  assignedTasks: any[] = [];
  currentUserId: string = '';
  isMobile: boolean;

  constructor(
    private userService: UserService,
    private taskApiService: TaskApiService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private platform: Platform,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.currentUserId = this.authService.getId() || '';
    this.isMobile = this.platform.is('mobile');
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data: any) => {
        this.users = Array.isArray(data) ? data : data.users || data.allUsers || [];
        console.log('Processed users:', this.users);
      },
      (error) => {
        console.error('Error loading users:', error);
        this.showNotification('Error loading users: ' + (error.message || 'Unknown error'));
      }
    );
  }

  onUserSelect(event: any) {
    console.log('User select event:', event);
    this.selectedUser = event.detail.value;
    console.log('Selected user:', this.selectedUser);
    if (this.selectedUser) {
      this.searchTasks();
    } else {
      console.warn('No user selected');
    }
  }
  
  searchTasks() {
    console.log('Searching tasks for user:', this.selectedUser);
    if (this.selectedUser) {
      this.taskApiService.getTasksCreatedBy(this.selectedUser).subscribe(
        (data) => {
          console.log('Raw created tasks data:', data);
          this.createdTasks = data.allTasks || [];
          console.log('Processed created tasks:', this.createdTasks);
        },
        (error) => {
          console.error('Error loading created tasks:', error);
          this.showNotification('Error loading created tasks');
        }
      );
  
      this.taskApiService.getTasksAssignedTo(this.selectedUser).subscribe(
        (data) => {
          console.log('Raw assigned tasks data:', data);
          this.assignedTasks = data.allTasks || [];
          console.log('Processed assigned tasks:', this.assignedTasks);
        },
        (error) => {
          console.error('Error loading assigned tasks:', error);
          this.showNotification('Error loading assigned tasks');
        }
      );
    } else {
      console.warn('No user selected');
      this.showNotification('Please select a user first');
    }
  }

  editTask(task: any) {
    this.router.navigate(['/edit-task', task.taskUid]);
  }

  async deleteTask(task: any) {
    if (this.isMobile) {
      const alert = await this.alertController.create({
        header: 'Confirm deletion',
        message: 'Are you sure you want to delete this task?',
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Delete',
            handler: () => this.performDeleteTask(task)
          }
        ]
      });
      await alert.present();
    } else {
      if (confirm('Are you sure you want to delete this task?')) {
        this.performDeleteTask(task);
      }
    }
  }

  private performDeleteTask(task: any) {
    this.taskApiService.deleteTask(task.taskUid).subscribe(
      () => {
        this.searchTasks();
        this.showNotification('Task deleted successfully');
      },
      (error) => {
        console.error('Error deleting task:', error);
        this.showNotification('Error deleting task');
      }
    );
  }

  private async showNotification(message: string) {
    if (this.isMobile) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000
      });
      toast.present();
    } else {
      this.snackBar.open(message, 'Close', { duration: 3000 });
    }
  }
}