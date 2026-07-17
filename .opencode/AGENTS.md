# Directorios del Proyecto para Agentes

## `.opencode/external-context/`

**Finalidad**: Caché persistente de documentación externa obtenida por el agente ExternalScout.

ExternalScout descarga documentación viva de librerías y frameworks externos (vía Context7 API o documentación oficial) y la persiste en este directorio. Los agentes principales y subagentes leen desde aquí sin necesidad de re-descargar.

**Estructura**:
```
.opencode/external-context/
├── .manifest.json         # Metadatos de toda la caché
├── {package-name}/
│   ├── {topic-1}.md       # Documentación filtrada por tema
│   └── {topic-2}.md
└── ...
```

**Reglas**:
- Solo ExternalScout escribe aquí
- Subagentes leen pero nunca modifican
- Archivos con >7 días se consideran obsoletos y se re-descargan
- Ruta configurada en `.opencode/context/core/config/paths.json` como `external_context`
