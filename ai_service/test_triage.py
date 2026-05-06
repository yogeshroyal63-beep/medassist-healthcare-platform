from model.triage_engine import triage

while True:

    user_input = input("Enter symptoms: ")

    age = input("Enter patient age: ")

    result = triage(user_input, age)

    print(result)