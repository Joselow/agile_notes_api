export const NOTE_TYPE = {
    text: {
        id: '1',
        name: 'text',
    },
    audio: {
        id: '2',
        name: 'audio',
    },
}



export const NOTE_TYPE_OPTIONS = ['text', 'audio']
export type NoteTypeT = keyof typeof NOTE_TYPE