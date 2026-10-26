# Elixir - what an interviewer actually asks

Written 26.10.2026, the day an Elixir task came up. The task itself goes in this file once Maksim describes it; everything below is the language, not the task.

Elixir runs on the Erlang VM, so most of what makes it strange is inherited from Erlang and all of it points the same way: many small processes, none of them sharing memory.



# The five things that decide whether you sound like you know it

## 1. Everything is immutable, and that is the whole design

There is no mutation. `list = [1 | list]` builds a new list; the old one is untouched. This is not a style choice - it is what makes it safe to run a hundred thousand processes at once, because no two of them can ever be looking at the same changing value.

Say it: "Nothing is shared and nothing mutates, so concurrency stops being about locks."

## 2. Pattern matching, and `=` is not assignment

`=` is the match operator. `x = 1` succeeds because `x` is unbound. `1 = x` also works. `2 = x` raises.

It goes everywhere - in function heads, which is how you branch without `if`:

```elixir
def area({:circle, r}), do: 3.14 * r * r
def area({:rect, w, h}), do: w * h
```

Three function clauses with the same name is normal and is the idiomatic replacement for a switch.

Say it: "I branch in the function head instead of inside the body."

## 3. The pipe operator

`|>` passes the left value as the **first** argument of the right call.

```elixir
bookings
|> Enum.filter(&(&1.status == :confirmed))
|> Enum.group_by(& &1.resource_id)
|> Enum.map(&summarise/1)
```

This is why almost every standard library function takes the data as its first argument. Knowing that reason, rather than just the symbol, is what the question is testing.

## 4. No loops. Recursion and `Enum`

There is no `for` that mutates a counter. You either recurse with an accumulator, or - far more often - use `Enum`.

`Enum` is eager: every step builds a full intermediate list. `Stream` is lazy: nothing runs until something forces it, so a long pipeline over a big input makes one pass.

Say it: "Enum does the work now and builds a list each step, Stream builds a recipe and runs it once at the end."

## 5. Processes, GenServer, supervision

A process is not an OS thread. It is a few kilobytes, spawned in microseconds, and the VM schedules millions of them. They never share memory; they send messages.

- **`spawn`** starts one.
- **`GenServer`** is the standard shape of a process that holds state and answers messages - `handle_call` when the caller waits for a reply, `handle_cast` when it does not.
- **Supervisor** watches child processes and restarts them on a declared strategy.

And the sentence everyone quotes, which is worth understanding rather than repeating: **let it crash.** You do not write defensive code for impossible states. The process dies, the supervisor restarts it clean, and the error is isolated to one request instead of corrupting shared state.

Say it: "State lives in a process, failures are isolated to that process, and a supervisor restarts it from a known good state."



# Smaller things that come up

- **Atoms** (`:ok`, `:error`) are constants whose name is their value. The common return shape is `{:ok, value}` or `{:error, reason}`, and you match on it.
- **`with`** chains several of those matches and exits at the first one that does not match - the clean way to avoid nested cases.
- **`case`, `cond`, `if`** exist, but a function head usually reads better.
- **Bang functions** - `File.read/1` returns a tuple, `File.read!/1` raises. The `!` means "raise instead of returning an error tuple".
- **Maps vs keyword lists** - `%{a: 1}` for data keyed at runtime, `[a: 1]` for options, because keyword lists allow duplicate keys and keep order.
- **Phoenix** is the web framework, **LiveView** renders server side and pushes diffs over a websocket, **Ecto** is the database layer and is not an ORM - queries are composable data.



# If asked something not known

The honest frame beats both bluffing and denial: name what is adjacent, then what is missing.

Say it: "I have not shipped Elixir in production. The model is familiar from the actor side - isolated state and message passing - and what I would need to learn is the OTP conventions and Ecto."
