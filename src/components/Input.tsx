import React from 'react';
import { IonInput, IonItem, IonLabel, IonText } from '@ionic/react';

interface InputProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'tel';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  required = false,
}) => {
  return (
    <>
      <IonItem className={error ? 'ion-invalid' : ''}>
        <IonLabel position="floating">
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </IonLabel>
        <IonInput
          type={type}
          value={value}
          placeholder={placeholder}
          onIonChange={(e) => onChange(e.detail.value!)}
        />
      </IonItem>
      {error && (
        <IonText color="danger" className="ion-padding-start">
          <small>{error}</small>
        </IonText>
      )}
    </>
  );
};

export default Input;
