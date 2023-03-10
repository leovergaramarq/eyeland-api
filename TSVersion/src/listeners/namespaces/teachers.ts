import { Socket } from "socket.io";
import { deleteSocket, printDirectory } from "../utils";

export const directory = new Map<number, Socket>();

export function onConnection(socket: Socket) {
    console.log('S: New teacher connection', socket.id);

    // EVENTS
    socket.on('id', onId);
    socket.on('join', onId);
    socket.on('disconnect', onDisconnect);

    // FUNCTIONS
    function onId(id: number) {
        console.log('S: teacher id', id);
        if (!validConnection(id)) {
            console.log('S: teacher invalid connection', socket.id);
            socket.disconnect();
            return;
        }
        directory.set(id, socket);
        printTeachersDir();
    }

    function onDisconnect() {
        console.log('S: teacher disconnected', socket.id);
        deleteSocket(socket, directory);
        printTeachersDir();
    }
}

function printTeachersDir() {
    printDirectory(directory, 'teachers');
}

function validConnection(id: number): boolean {
    return !directory.has(id);
}
