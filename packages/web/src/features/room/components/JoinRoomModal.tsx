import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import { useJoinRoom } from "../contexts/JoinRoom";

const JoinRoomModal = (): JSX.Element => {
  const { joinedRoom, setJoinedRoom } = useJoinRoom();
  const joinRoom = () => setJoinedRoom(true);

  return (
    <Modal isOpen={!joinedRoom} onClose={joinRoom}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome to WeWatch</ModalHeader>
        <ModalCloseButton />
        <ModalFooter>
          <Button colorScheme="blue" onClick={joinRoom}>
            Join Room
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinRoomModal;
