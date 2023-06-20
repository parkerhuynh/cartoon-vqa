import torch
def train(epoch, model, train_loader, loss_function, optimizer, args):
    model.train()
    print(f"---------- TRAINING ----------")
    running_loss = 0.0
    predicts = []
    labels = []
    for i, data in enumerate(train_loader):

        optimizer.zero_grad()
        questions, answers, images = data
        questions = questions.to("cuda")
        answers = answers.to("cuda")
        images = images.to("cuda")
        predictions = model(images, questions)
        _, pred_exp = torch.max(predictions, 1)

        predicts += pred_exp.cpu()
        labels += answers.cpu()

        loss = loss_function(predictions, answers)
        loss.backward()
        running_loss += loss.item()
        optimizer.step()
        if (i+1) % args.fre_print == 0:
            print(f"  [{i+1}/{len(train_loader)}] Loss: {round(loss.item(), 2)}")
    correct = sum([1 if predicts.item() == labels.item() else 0 for predicts, labels in zip(predicts, labels)])
    accuracy = correct / len(predicts) * 100
    return running_loss/i, accuracy
    