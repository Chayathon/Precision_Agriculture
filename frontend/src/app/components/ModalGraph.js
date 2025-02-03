import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Card, CardHeader } from '@nextui-org/react'


function ModalGraph({ isOpen, onOpenChange, id, setRefresh }) {



    return (
        <>
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">กราฟ</ModalHeader>
                        <ModalBody>
                





                                <ModalFooter>
                                    <Button variant="flat" onPress={onClose}>
                                        ยกเลิก
                                    </Button>
                                    <Button type='submit' color="warning">
                                        แก้ไข
                                    </Button>
                                </ModalFooter>
    
                        </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )

}


export default ModalGraph