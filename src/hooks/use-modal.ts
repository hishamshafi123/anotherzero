'use client';
import { useState, useCallback } from 'react';

export type ModalType = 'contact-detail' | 'campaign-detail' | 'ab-test-detail' | 'template-editor' | 'strategy-editor';

export const useModal = () => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = useCallback((type: ModalType, data?: any) => {
    console.log(`Opening modal: ${type}`, data);
    setActiveModal(type);
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    console.log('Closing modal');
    setActiveModal(null);
    setModalData(null);
  }, []);

  return {
    activeModal,
    modalData,
    openModal,
    closeModal,
    isOpen: (type: ModalType) => activeModal === type
  };
};