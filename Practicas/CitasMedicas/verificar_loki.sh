#!/bin/bash

echo "🔍 Verificando el stack de Loki..."
echo "=================================="

# Verificar que los contenedores estén corriendo
echo "📦 Verificando contenedores:"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(loki|promtail|grafana)"

echo ""
echo "🔌 Verificando conectividad:"

# Verificar Loki
echo -n "Loki (puerto 3100): "
if curl -s http://localhost:3100/ready > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FALLO"
fi

# Verificar Grafana
echo -n "Grafana (puerto 3001): "
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FALLO"
fi

echo ""
echo "📋 Verificando logs en Loki:"

# Verificar si hay logs de cada servicio
services=("usuarios" "reservas" "especialidades")
for service in "${services[@]}"; do
    echo -n "Logs de $service: "
    result=$(curl -s -G "http://localhost:3100/loki/api/v1/query" --data-urlencode "query={job=\"$service\"}" | jq -r '.data.result | length')
    if [ "$result" -gt 0 ]; then
        echo "✅ $result streams encontrados"
    else
        echo "⚠️  Sin logs (puede ser normal si el servicio no ha generado logs aún)"
    fi
done

echo ""
echo "🏃‍♂️ Generando logs de prueba:"

# Hacer algunas peticiones para generar logs
echo "Haciendo peticiones a los servicios..."
curl -s http://localhost:3000/health > /dev/null && echo "✅ Auth service"
curl -s http://localhost:4000/health > /dev/null && echo "✅ Reservas service" 
curl -s http://localhost:5000/health > /dev/null && echo "✅ Especialidades service"

echo ""
echo "🎯 URLs importantes:"
echo "- Grafana: http://localhost:3001 (admin/admin123)"
echo "- Loki API: http://localhost:3100"
echo ""
echo "📝 Query examples para Grafana:"
echo '- Todos los logs: {job=~".*"}'
echo '- Logs de reservas: {job="reservas"}'
echo '- Logs con errores: {job=~".*"} |= "ERROR"'