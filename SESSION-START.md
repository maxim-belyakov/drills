# How to open a session

Paste the block below as the first message of a new Cowork task. Everything else the
session needs is in `README.md` and `PARKING.md`, which that block tells it to read.

Written 2026-09-11, after a session where the sandbox lost its network access mid-way and
nobody noticed until the push failed at the end of the day.

---

## The opening message

```
Это чат ежедневных повторений к интервью, программа приёмов. Подключена папка
drills - это артефакт программы.

ПЕРВЫМ ДЕЛОМ, до любой другой работы: проверь, можешь ли ты делать полный цикл git
в этой папке, и доложи результат до того, как начнём заниматься. Проверка настоящая,
не "вроде должно работать":

  1. git status и git log - чтение
  2. доступ в сеть из песочницы: curl -s -o /dev/null -w "%{http_code}" https://github.com
  3. полный круг: создать временную ветку, запушить её, удалить на origin
  4. подчистить .git/*.lock и tmp_obj_* после себя

Доложи по каждому пункту ✅ или ❌ одной строкой. Если пуш не проходит - скажи сразу,
а не в конце дня.

Затем прочитай в папке drills:
  README.md   - правила программы, журнал, счётчик, что осталось
  PARKING.md  - накопленные находки
и работай по ним.

Чего нет в README:
- Режим ответов /i-have-adhd включён: первая строка - действие, нумерованные шаги,
  состояние каждый ход, одно конкретное следующее действие в конце, без преамбул.
- Никаких длинных тире, только короткие дефисы. Везде, включая код и комментарии.
- Все git-команды в этой папке - через обёртку $HOME/g.sh (см. ниже). Она нужна,
  потому что виртуалка не может удалять файлы в примонтированной папке и оставляет
  залипшие .git/*.lock, которые потом ломают git на моей машине.
- Приёмы на .jsx нельзя проверять на устройстве: там Linux, а бинарник esbuild
  собран под darwin. Зеркало репозитория в облачном контейнере, прогоняй проверки там.
- Карточки живут в Obsidian. Перед любой записью в него вызывай навык vault-rules.
- Коммит и пуш в тот же заход, в котором закрыт приём. Коммиты под моим именем,
  твоё участие - трейлером Co-Authored-By в теле сообщения.

Сегодня <день недели>, готов.
```

---

## The git wrapper

The VM cannot `unlink` inside the mounted folder, so git leaves `.git/*.lock` files
behind and the next command on the Mac fails with "Unable to create index.lock".
Recreate this at `$HOME/g.sh` in the VM whenever it is missing, and route every git
command through it.

```bash
#!/bin/bash
R="$HOME/mnt/drills"
cd "$R" || exit 1
git --no-optional-locks "$@"
rc=$?
T="$R/.git/.trash"; mkdir -p "$T"
for f in "$R"/.git/index.lock "$R"/.git/HEAD.lock "$R"/.git/packed-refs.lock "$R"/.git/config.lock; do
  [ -e "$f" ] && mv "$f" "$T/$(basename "$f").$$" 2>/dev/null
done
find "$R/.git/refs" -name '*.lock' -exec mv {} "$T/" \; 2>/dev/null
find "$R/.git/objects" -name 'tmp_obj_*' -exec mv {} "$T/" \; 2>/dev/null
exit $rc
```

---

## Known failure modes, and what each one means

| Symptom | What it actually is | What to do |
|---|---|---|
| `403 from proxy after CONNECT`, header `X-Proxy-Error: blocked-by-allowlist` | The egress filter of the Linux sandbox on the Mac. Not GitHub, not the token - the tunnel never opens. Check it: `curl https://api.anthropic.com` passes while everything else is blocked. | Cannot be fixed from inside the session. Push from the Mac's own terminal. |
| `access denied by the git proxy: ... not in this session's authorized repository set` | Anthropic's git proxy. The repository list is fixed when the task is created. Read works, write does not. | Add the repository to the task's sources when creating the task, if the interface offers it. |
| `GitHub access to this repository is not enabled for this session` on the API | The Claude GitHub App has no installation covering the repo. | github.com/apps/claude/installations/new, select the repo. Done on 2026-09-11. |
| `fatal: Unable to create '.git/index.lock': File exists` on the Mac | A leftover lock from the sandbox. | Route sandbox git through `g.sh`; delete the lock on the Mac. |
