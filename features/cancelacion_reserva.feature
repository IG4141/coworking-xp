Feature: Cancelacion de reservas
  Como usuario registrado
  Quiero cancelar una reserva
  Para liberar el espacio si cambian mis planes

  Scenario: Cancelacion exitosa de una reserva propia
    Given que "juan" tiene una reserva confirmada de la "Sala A" para el "2026-10-15"
    When "juan" cancela esa reserva
    Then la reserva debe quedar cancelada
    And la "Sala A" debe volver a aparecer en la lista de disponibles para el "2026-10-15"

  Scenario: Intento de cancelar una reserva de otro usuario
    Given que "juan" tiene una reserva confirmada de la "Sala A" para el "2026-10-15"
    And el usuario "maria" existe en el sistema
    When "maria" intenta cancelar la reserva de "juan"
    Then el sistema debe rechazar la cancelacion
    And debe mostrar el mensaje de error "No puede cancelar una reserva que no le pertenece"
