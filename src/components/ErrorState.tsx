import React from 'react';
import { IonIcon, IonText, IonButton } from '@ionic/react';
import { alertCircleOutline, refreshOutline } from 'ionicons/icons';

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    title = 'Algo salió mal',
    message,
    onRetry
}) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '300px',
            width: '100%',
            padding: '20px',
            textAlign: 'center'
        }}>
            <div style={{
                background: 'var(--ion-color-danger-tint)',
                borderRadius: '50%',
                padding: '20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <IonIcon icon={alertCircleOutline} style={{ fontSize: '48px', color: 'white' }} />
            </div>

            <IonText color="dark">
                <h2 style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>{title}</h2>
            </IonText>

            <IonText color="medium">
                <p style={{ margin: '0 0 20px 0', maxWidth: '300px' }}>{message}</p>
            </IonText>

            {onRetry && (
                <IonButton onClick={onRetry} color="primary" shape="round">
                    <IonIcon slot="start" icon={refreshOutline} />
                    Reintentar
                </IonButton>
            )}
        </div>
    );
};

export default ErrorState;
