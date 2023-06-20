
import torch
def valid(epoch, model, val_loader, loss_function):
    model.eval()
    print(f"---------- VALIDATING ----------")
    running_loss = 0.0
    predicts = []
    labels = []
    for i, data in enumerate(val_loader):
        questions, answers, images = data
        questions = questions.to("cuda")
        answers = answers.to("cuda")
        images = images.to("cuda")
        predictions = model(images, questions)

        _, pred_exp = torch.max(predictions, 1)

        predicts += pred_exp
        labels += answers
        loss = loss_function(predictions, answers)
        running_loss += loss.item()
    correct = sum([1 if predicts.item() == labels.item() else 0 for predicts, labels in zip(predicts, labels)])
    accuracy = correct / len(predicts) * 100
    return running_loss/i, accuracy
    