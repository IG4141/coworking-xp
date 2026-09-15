Feature: Reserva de espacios
  Como usuario registrado
  Quiero reservar una sala de reuniones
  Para tener un lugar privado de trabajo

  Scenario: Reserva exitosa de una sala disponible
    Given que la sala "Sala A" esta disponible el "2026-10-15"
    And el usuario "juan" existe en el sistema
    When "juan" intenta reservar la "Sala A" para el "2026-10-15"
    Then la reserva debe confirmarse exitosamente
    And la "Sala A" no debe aparecer en la lista de disponibles para el "2026-10-15"

  Scenario: Intento de reserva de una sala ya ocupada
    Given que la sala "Sala A" esta ocupada el "2026-10-15"
    And el usuario "juan" existe en el sistema
    When "juan" intenta reservar la "Sala A" para el "2026-10-15"
    Then el sistema debe rechazar la reserva
    And debe mostrar el mensaje de error "Sala no disponible"
