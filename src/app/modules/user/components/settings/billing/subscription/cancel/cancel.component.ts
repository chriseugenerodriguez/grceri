import { PlanAPIService } from './../../../../../../../shared/services/api/plan.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

// SUBSCRIPTIONS
import { Subscription, interval } from 'rxjs';

// SERVICES
import { ModalService, UserAPIService, SubscriptionAPIService, LocalStorage } from '../../../../../../../shared/services';

// COMPONENT
@Component({
    moduleId: module.id,
    selector: 'settings-subscription-cancel',
    templateUrl: 'cancel.component.html',
    styleUrls: ['cancel.component.scss']
})

// CLASS
export class SettingsSubscriptionCancelComponent implements OnInit, OnDestroy {
    private _subscriptions: any = new Subscription();
    private _timerSubscription: Subscription;

    // INPUT
    @Input('subscription') userSubscription: string;

    // NUMBER
    id: number = this._localStorage.get('userId');

    config = {
        class: 'modal-popup',
        animated: false,
        backdrop: true,
    };

    days: number;
    hours: number;
    minutes: number;
    seconds: number;

    constructor(
        private _subscriptionService: SubscriptionAPIService,
        private _userService: UserAPIService,
        private _modalService: ModalService,
        private _localStorage: LocalStorage,
        private _planSubscription: PlanAPIService
    ) { }

    ngOnInit() {
        this._processModalResponseInformation();
        this._checkSubscriptionStatus();
    }

    ngOnDestroy() {
        this._subscriptions.unsubscribe();
        if (this._timerSubscription) {
            this._timerSubscription.unsubscribe();
        }
    }

    private _checkSubscriptionStatus() {
        if (this.userSubscription
            && this.userSubscription['plan'] !== 'free'
            && this.userSubscription['planStatus'] === 'canceled') {
            this._initializeTimer();
        }
    }

    private _initializeTimer() {
        const source = interval(1000);

        this._timerSubscription = source.subscribe(val => {
            let now = new Date().getTime();
            let countDownDate = new Date(this.userSubscription['subscriptionCycleEndDate']).getTime();
            let distance = countDownDate - now;

            if (distance <= 0) {
                this._timerSubscription.unsubscribe();
                this._refreshSubscription();
                return false;
            }

            this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
            this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
        });
    }

    private _refreshSubscription() {
        this.days = undefined;
        this.hours = undefined;
        this.minutes = undefined;
        this.seconds = undefined;

        this._subscriptions.add(this._subscriptionService.processSubscriptionAPI(this.id).subscribe((res) => res));
        this._subscriptions.add(this._planSubscription.processPlanLimits(this.id).subscribe((res) => res));
    }

    private _processModalResponseInformation(): void {
        this._subscriptions.add(this._modalService.fetchModalData().subscribe(res => {
            if (res) {
                switch (res.type) {
                    case 'success-cancel-subscription':
                        this._cancelSubscription();
                        break;
                    case 'confirm-cancel-subscription':
                        let message: any = this._modalService.processModalAlertInformation('cancel-subscription', 'Are you sure to cancel the subscription? ');
                        this._modalService.data$.next(message);
                        this._modalService.openConfirmationModal(this.config);
                        break;
                }
            }
        }));
    }

    confirmCancelSubscription($event: any) {
        $event.preventDefault();

        let message: any;

        message = this._modalService.processModalAlertInformation('empty-message', 'confirmed');
        this._modalService.data$.next(message);

        message = this._modalService.processModalAlertInformation('cancel-subscription', 'Are you sure to cancel the subscription? ');
        this._modalService.data$.next(message);

        this._modalService.openConfirmCancelSubscriptionModal(this.config);
    }

    private _cancelSubscription() {
        let userId: number = this._localStorage.get('userId');

        let obj: any = {
            userId,
            planToRemove: this.userSubscription['stripePlanId']
        }

        this._subscriptions.add(this._userService.cancelSubscription(obj).subscribe((res: any) => {
            if (res) {
                let canceledPlan = res.find((plan: any) => plan.stripePlanId === this.userSubscription['stripePlanId']);
                if (canceledPlan) {
                    this.userSubscription = canceledPlan;
                    this._subscriptionService.subscription$.next(canceledPlan);
                    this._checkSubscriptionStatus();
                    let message: any = this._modalService.processModalAlertInformation('cancel-subscription-success-message', 'The subscription plan has been canceled successfully');
                    this._modalService.data$.next(message);
                }
            }
        }, (error) => {
            let message: any = this._modalService.processModalAlertInformation('cancel-subscription-error-message', 'You do not have any subscription plan to cancel');
            this._modalService.data$.next(message);
        }))
    }
}
