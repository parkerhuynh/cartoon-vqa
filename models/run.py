import argparse, yaml
from Data_Generator import DataSet
import torch.utils.data as Data
from config import data_config, model_config
from vqa_models.VQA import VqaModel
import torch.nn as nn
import torch.optim as optim
from train import train
from valid import valid
import wandb
from vqa_models.SAN import SANModel

def parse_args():
    '''
    Parse input arguments
    '''
    parser = argparse.ArgumentParser(description='MCAN Args')

    parser.add_argument('--run', dest='run_mode',
                        default='train',
                        choices=['train', 'val', 'test'],
                        help='{train, val, test}',
                        type=str)

    parser.add_argument('--model', dest='model',
                        default="VQA",
                        choices=['VQA', 'SAN'],
                        type=str)

    parser.add_argument('--bs', dest='batch_size',
                        default=4,
                        type=int)

    parser.add_argument('--max_ques_len', dest='max_ques_len',
                        default=40,
                        type=int)

    parser.add_argument('--use_glove', dest='use_glove',
                        default=True,
                        type=bool)
    
    parser.add_argument('--num_workers', dest='num_workers',
                        default=8,
                        type=int)

    parser.add_argument('--gpu', dest='gpu',
                        default=0,
                        help="gpu select, eg.'0, 1, 2'",
                        type=str)

    parser.add_argument('--img_size', dest='img_size',
                        default=224,
                        help="Image Encoder model",
                        type=int)

    parser.add_argument('--img_path', dest='img_path',
                        default="./data/images/",
                        help="Image Path",
                        type=str)
    
    parser.add_argument('--lr', dest='learning_rate',
                        default=10e-4,
                        help="Image Path",
                        type=float)

    parser.add_argument('--epoch', dest='epoch',
                        default=5,
                        help="Image Path",
                        type=int)

    parser.add_argument('--fre-print', dest='fre_print',
                        default=1000,
                        help="Image Path",
                        type=int)
    
    parser.add_argument('--wandb', dest='wandb',
                        default=False,
                        type=bool)



    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = parse_args()
    if args.wandb:
        wandb.init(
            # set the wandb project where this run will be logged
            project="cartoon-vqa",
            
            # track hyperparameters and run metadata
            config={
            "learning_rate": args.learning_rate,
            "architecture": args.model,
            "dataset": "cartoon-vqa",
            "epochs": args.epoch,
            "batch_size": args.batch_size
            }
        )
    if args.run_mode == "train":
        train_dataset = DataSet("train", args)
        train_dataloader = Data.DataLoader(
                train_dataset,
                batch_size=args.batch_size,
                shuffle=True,
                num_workers=args.num_workers,
                pin_memory=True,
                drop_last=True)
        
        val_dataset = DataSet("val", args)
        val_dataloader = Data.DataLoader(
                val_dataset,
                batch_size=args.batch_size,
                shuffle=False,
                num_workers=args.num_workers,
                pin_memory=True)
    if args.model == "VQA":
        print("Creating Model!")
        model = VqaModel(question_vocab_size = train_dataset.token_size,
                        ans_vocab_size = train_dataset.ans_size, 
                        model_config = model_config[args.model]).to("cuda")
        
        params = list(model.image_encoder.fc.parameters()) \
        + list(model.question_encoder.parameters()) \
        + list(model.fc1.parameters()) \
        + list(model.fc2.parameters())
    elif args.model == "SAN":
        model = SANModel(
            question_vocab_size = train_dataset.token_size,
            ans_vocab_size = train_dataset.ans_size,
            model_config = model_config[args.model],).to("cuda")
        params = model.parameters()


    loss_function = nn.CrossEntropyLoss()
    optimizer = optim.Adam(params, lr=args.learning_rate)
    if args.run_mode == "train":
        for epoch in range(1, args.epoch+1):
            print(f"********** EPOCH {epoch} **********")

            train_loss, train_accuracy = train(epoch, model, train_dataloader, loss_function, optimizer, args)

            val_loss, val_accuracy = valid(epoch, model, val_dataloader, loss_function)
            print(f"\nTRAIN LOSS      : {round(train_loss,2):.2f}  | VALIDATION LOSS     : {round(val_loss,2):.2f} ")
            print(f"TRAIN ACCURANCY: {train_accuracy:.2f}% |  VALIDATION ACCURANCY: {val_accuracy:.2f}%\n")
            if args.wandb:
                wandb.log({
                    "epoch": epoch,
                    "train_loss": train_loss,
                    "train_acc": train_accuracy/100,
                    "val_loss": val_loss,
                    "val_acc": val_accuracy/100
                })
    if args.wandb:
        wandb.finish()

                


            
    

    
    

    
    
