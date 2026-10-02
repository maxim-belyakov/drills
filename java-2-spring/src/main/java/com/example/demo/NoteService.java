package com.example.demo;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class NoteService {

    private final List<Note> notes = new ArrayList<>();

    public List<Note> findAll() {
        return notes;
    }

    public Note create(String text) {
        Note note = new Note(UUID.randomUUID().toString(), text);
        notes.add(note);
        return note;
    }
}
