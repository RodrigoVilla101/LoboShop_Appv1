import { useIonToast } from '@ionic/react';
import { checkmarkCircleOutline, alertCircleOutline, informationCircleOutline } from 'ionicons/icons';

export const useToast = () => {
    const [present] = useIonToast();

    const showSuccess = (message: string) => {
        present({
            message,
            duration: 2000,
            color: 'success',
            icon: checkmarkCircleOutline,
            position: 'top',
            cssClass: 'custom-toast'
        });
    };

    const showError = (message: string) => {
        present({
            message,
            duration: 3000,
            color: 'danger',
            icon: alertCircleOutline,
            position: 'top',
            cssClass: 'custom-toast'
        });
    };

    const showInfo = (message: string) => {
        present({
            message,
            duration: 2000,
            color: 'primary',
            icon: informationCircleOutline,
            position: 'top',
            cssClass: 'custom-toast'
        });
    };

    return { showSuccess, showError, showInfo };
};
