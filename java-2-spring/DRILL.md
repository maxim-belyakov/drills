
# J8 Spring Boot - minimal controller

Ladder step 1 of 3: fill the blanks. Step 2: same files with only the class shells. Step 3: from an empty folder, 10 minutes, no Google.

Spring Boot 4.1.1, Java 21, Gradle. The web starter is `spring-boot-starter-webmvc` (Boot 4 name for Spring Web).



# Task

Fill every `___` in `src/main/java/com/example/demo/NoteService.java` and `NoteController.java`. `Note.java` is given.

Word bank: `@Service`, `@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@RequestBody`, `@ResponseStatus`, `HttpStatus.CREATED`, `this`, `notes`, `note`, `text`, `findAll`.



# Check

```
./gradlew bootRun
curl localhost:8080/notes
curl -X POST localhost:8080/notes -H 'Content-Type: application/json' -d '{"text":"hello"}'
curl localhost:8080/notes
```

Green: first GET `[]`, POST `201` with `{"id":"...","text":"hello"}`, second GET shows the note.



# Break it

Comment out `@Service`, run again. Expected:

```
Parameter 0 of constructor in com.example.demo.NoteController required a bean of type 'com.example.demo.NoteService' that could not be found.
```

Put it back.



# Say it (60 seconds, recorded)

1. What is a bean, and who creates it.
2. Why constructor injection instead of `new NoteService()` inside the controller.
3. The dated-gap frame: "Spring Boot I have not run in production. My backend is Java 21 on Lambda without a framework, so I will write you a controller with constructor injection, but I would not claim depth on Spring Data or its transaction handling."
