Feature: Disponibilidad de salas
  Como usuario registrado
  Quiero ver la disponibilidad de salas por fecha
  Para elegir un horario libre

  Scenario: Consultar disponibilidad cuando la sala esta libre
    Given que la sala "Sala A" existe y esta disponible el "2026-10-15"
    When se consulta la disponibilidad para el "2026-10-15"
    Then la "Sala A" debe aparecer en la lista de disponibles

  Scenario: Consultar disponibilidad cuando la sala ya esta ocupada
    Given que la sala "Sala A" esta ocupada el "2026-10-15"
    When se consulta la disponibilidad para el "2026-10-15"
    Then la "Sala A" no debe aparecer en la lista de disponibles
