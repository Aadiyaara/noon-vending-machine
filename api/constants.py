import enum


class OrderStatus(enum.Enum):
    IDLE = "IDLE"
    PROCESSING = "PROCESSING"
    SUCCESSFUL = 'SUCCESSFUL'
    FAILURE = 'FAILURE'
