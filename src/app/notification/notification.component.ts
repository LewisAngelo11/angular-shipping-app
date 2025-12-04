import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-notification',
    imports: [CommonModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit, OnDestroy {
    notifications: Notification[] = [];
    private subscription?: Subscription;

    constructor(private notificationService: NotificationService) { }

    ngOnInit() {
        this.subscription = this.notificationService.notifications$.subscribe(
            (notification) => {
                this.notifications.push(notification);

                // Auto-remove notification after duration
                setTimeout(() => {
                    this.removeNotification(notification.id);
                }, notification.duration || 4000);
            }
        );
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    removeNotification(id: string) {
        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    getIcon(type: string): string {
        switch (type) {
            case 'success':
                return 'bx-check-circle';
            case 'error':
                return 'bx-error-circle';
            case 'warning':
                return 'bx-error';
            case 'info':
                return 'bx-info-circle';
            default:
                return 'bx-bell';
        }
    }
}
