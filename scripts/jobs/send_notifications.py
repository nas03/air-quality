import requests


def sendNotification():
    requests.post("/notification/send-email")


__all__ = ["sendNotification"]
