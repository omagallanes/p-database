# Plan: cutover de `version-2` a `main`

**Estado:** Por ejecutar — borrador de plan acordado.  
**Última actualización:** 2026-07-17  
**Propuesto por:** @omagallanes  
**Revisado por:** OAC repo-manager

---

## Objetivo

- El historial de `main` (pre-version-2) **desaparece** de GitHub.
- El historial de `version-2` (29 commits) **desaparece** de GitHub.
- En GitHub, `main` arranca desde **1 commit limpio** con el contenido actual.
- En local, los 29 commits de `version-2` se preservan **vía un tag** por si se necesitan después.
- Local y remoto quedan **coherentes** (apuntan al mismo commit).

---

## Resumen de la estrategia (A + 1 + tag)

La combinación acordada:

| Componente | Descripción |
|---|---|
| **Opción A** | La rama final se llama `main` |
| **Opción 1** | Commit huérfano (sin padres) — 1 solo commit, sin historia arrastrada |
| **Tag `v2-snapshot`** | Preserva el hash del último commit de `version-2` para recuperación futura |

---

## Estado actual del repo

```
main  ───── 1f1e972 [Fin todas las fases - eliminar seed - usr nuevos]
                    \
version-2 ───── 37bb4b8 - ... - 0fb44b0 - ... - 7944d69
                (29 commits sobre main)
```

- `main` es ancestro directo de `version-2` (0 commits únicos en `main`)
- La rama default en GitHub es `main`
- No hay PRs abiertos, nadie más tiene checkout

---

## Plan paso a paso

### Fase 1 — Tag de respaldo (local)

```bash
git tag v2-snapshot version-2
```

Crea un tag ligero apuntando al HEAD de `version-2`. Esto preserva:

- Los 29 commits completos
- La capacidad de hacer `git diff`, `git show`, crear una rama desde ahí
- No se pushea el tag a GH a menos que se quiera (opcional)

---

### Fase 2 — Commit huérfano (local)

```bash
git checkout --orphan main-clean
git add -A
git commit -m "v2: prompt database — cutover desde version-2"
```

Resultado:

```
main-clean  ───── [nuevo commit #1]   ← sin padres, contiene todo
```

---

### Fase 3 — Reemplazar `main` (local)

```bash
git branch -D main            # borra la vieja rama main local
git branch -m main-clean main # renombra la nueva a main
```

Resultado local:

```
main  ───── [nuevo commit #1]   ← HEAD
v2-snapshot → 7944d69            ← tag de respaldo

(1f1e972, 37bb4b8... etc. siguen en .git/objects pero sin rama que los refiera)
```

---

### Fase 4 — Pushear a GitHub

```bash
# Cambiar default branch en GitHub (Settings → Branches → cambiar a main si ya lo es)
# Para evitar errores, se puede cambiar temporalmente a version-2 y luego devolver

# Borrar version-2 remota (para que GH no tenga la rama)
git push origin --delete version-2

# Force push del nuevo main (solo 1 commit)
git push -f origin main
```

---

### Fase 5 — Verificación

```bash
git log --oneline main          # Solo 1 commit
git log --oneline v2-snapshot   # 29 commits
git diff main v2-snapshot       # Debería estar vacío (mismo contenido)
```

---

## Estado final

### GitHub

```
main  ───── [v2: prompt database — cutover desde version-2]   ← 1 commit
```

### Local

```
main  ───── [v2: prompt database — cutover desde version-2]   ← 1 commit
  tags/v2-snapshot → 7944d69                                   ← 29 commits preservados

(Ambos árboles idénticos, historias diferentes)
```

---

## Recuperación futura (si hace falta)

Si en el futuro se necesita un cambio de los 29 commits:

```bash
git branch version-2-recov v2-snapshot   # crea rama desde el tag
# o
git log v2-snapshot                      # ver historial
git show <hash>                          # ver diff de un commit específico
# cherry-pick algún cambio concreto
git cherry-pick <hash>
```

---

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Pérdida del tag `v2-snapshot` si se borra `.git` local | Pushear el tag opcionalmente: `git push origin v2-snapshot` |
| Colaboradores con checkout de `main` viejo | Avisar antes de ejecutar; nadie más trabaja en el repo |
| GH Actions/disparadores rotos por historial | No debería afectar — solo cambia el commit al que apunta `main` |

---

## Checklist de ejecución

- [ ] Tag: `git tag v2-snapshot version-2`
- [ ] Orphan: `git checkout --orphan main-clean && git add -A && git commit -m "v2: prompt database — cutover desde version-2"`
- [ ] Borrar main local vieja: `git branch -D main`
- [ ] Renombrar: `git branch -m main-clean main`
- [ ] En GitHub: cambiar default branch (si es necesario)
- [ ] Borrar version-2 remota: `git push origin --delete version-2`
- [ ] Force push main: `git push -f origin main`
- [ ] Verificar: `git log --oneline main`, `git diff main v2-snapshot`
- [ ] (Opcional) Pushear tag: `git push origin v2-snapshot`
