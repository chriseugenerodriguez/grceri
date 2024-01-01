import { Component, Input } from '@angular/core';

// INTERFACES
import { ISubscription } from '../../../../../../../shared/interfaces';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'settings-subscription-plan',
	templateUrl: 'plan.component.html',
})

// CLASS
export class SettingsSubscriptionPlanComponent {
	@Input() plan: ISubscription;

	constructor() {
	}
}
