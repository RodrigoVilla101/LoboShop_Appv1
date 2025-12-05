import React from 'react';
import { IonSpinner, IonText } from '@ionic/react';

interface LoadingStateProps {
    message?: string;
    fullScreen?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
    message = 'Cargando...',
    fullScreen = false
}) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: fullScreen ? '100vh' : '300px',
            width: '100%',
            padding: '20px'
        }}>
            <IonSpinner name="crescent" color="primary" style={{ transform: 'scale(1.5)' }} />
            <IonText color="medium" style={{ marginTop: '20px', fontWeight: 500 }}>
                <p>{message}</p>
            </IonText>
        </div>
    );
};

export default LoadingState;
