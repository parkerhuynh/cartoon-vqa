import numpy as np
import glob, json, torch, time
import torch.utils.data as Data
import re
import numpy as np
import en_core_web_lg, random, re, json
import pandas as pd
import sys
import torchvision.transforms as transforms
from PIL import Image
def ques_load(ques_list):
    qid_to_ques = {}
    for ques in ques_list:
        qid = str(ques['question_id'])
        qid_to_ques[qid] = ques

    return qid_to_ques

def tokenize(stat_ques_list, use_glove):
    token_to_ix = {
        'PAD': 0,
        'UNK': 1,
    }

    spacy_tool = None
    pretrained_emb = []
    if use_glove:
        spacy_tool = en_core_web_lg.load()
        pretrained_emb.append(spacy_tool('PAD').vector)
        pretrained_emb.append(spacy_tool('UNK').vector)
    for ques in stat_ques_list:
        words = re.sub(
            r"([.,'!?\"()*#:;])",
            '',
            ques['question'].lower()
        ).replace('-', ' ').replace('/', ' ').split()

        for word in words:
            if word not in token_to_ix:
                token_to_ix[word] = len(token_to_ix)
                if use_glove:
                    pretrained_emb.append(spacy_tool(word).vector)

    pretrained_emb = np.array(pretrained_emb)
    return token_to_ix, pretrained_emb

def ans_stat(json_file):
    ans_to_ix, ix_to_ans = json.load(open(json_file, 'r'))
    return ans_to_ix, ix_to_ans

def proc_ques(ques, token_to_ix, max_token):
    ques_ix = np.zeros(max_token, np.int64)

    words = re.sub(
        r"([.,'!?\"()*#:;])",
        '',
        ques['question'].lower()
    ).replace('-', ' ').replace('/', ' ').split()

    for ix, word in enumerate(words):
        if word in token_to_ix:
            ques_ix[ix] = token_to_ix[word]
        else:
            ques_ix[ix] = token_to_ix['UNK']

        if ix + 1 == max_token:
            break

    return ques_ix

class DataSet(Data.Dataset):
    def __init__(self, mode, args):
        self.mode = mode
        self.MAX_TOKEN = args.max_ques_len
        self.transform = transforms.Compose([
                            transforms.ToTensor(),
                            transforms.Resize(size = (args.img_size,args.img_size)),
                            transforms.Normalize((0.485, 0.456, 0.406),\
                                                (0.229, 0.224, 0.225))])
        self.img_path = args.img_path


        if self.mode =="train":
            split_list = ["train"]
        else:
            split_list = ["val"]

        QUESTION_PATH = {'train': './data/v1_Question_Train_simpsoon_vqa.json', 
                         'val': './data/v1_Question_Val_simpsoon_vqa.json', 
                         'test': './data/v1_Question_Test_simpsoon_vqa.json'}
        self.stat_ques_list = \
            json.load(open(QUESTION_PATH['val'], 'r'))['questions']
        

        # Loading question and answer list
        ANSWER_PATH = {'train': './data/v1_Annotation_Train_simpsoon_vqa.json',
                       'val': './data/v1_Annotation_Val_simpsoon_vqa.json'}
        self.ques_list = []
        self.ans_list = []
        if self.mode =="train":
            split_list = ["train"]
        else:
            split_list = ["val"]
        for split in split_list:
            self.ques_list += json.load(open(QUESTION_PATH[split], 'r'))['questions']
            if self.mode in ['train', "val"]:
                self.ans_list += json.load(open(ANSWER_PATH[split], 'r'))['annotations']
        # Define run data size
        if self.mode in ['train']:
            self.data_size = self.ans_list.__len__()
        else:
            self.data_size = self.ques_list.__len__()

        print('== Dataset size:', self.data_size)
        
        self.qid_to_ques = ques_load(self.ques_list)

        # Tokenize
        self.token_to_ix, self.pretrained_emb = tokenize(self.stat_ques_list, args.use_glove)
        self.token_size = self.token_to_ix.__len__()
        print('== Question token vocab size:', self.token_size)


        self.ans_to_ix, self.ix_to_ans = ans_stat('./data/answer_dict.json')
        self.ans_size = self.ans_to_ix.__len__()
        print('== Answer vocab size (occurr more than {} times):'.format(8), self.ans_size)
        print('Finished!')
        print('')


    def __getitem__(self, idx):

        # For code safety
        ques_ix_iter = np.zeros(1)
        ans_iter = np.zeros(1)


        # Process ['train'] and ['val', 'test'] respectively
        if self.mode in ['train', "val"]:
            # Load the run data from list
            ans = self.ans_list[idx]
            ques = self.qid_to_ques[str(ans['question_id'])]

            # Process question
            ques_ix_iter = proc_ques(ques, self.token_to_ix, self.MAX_TOKEN)

            # Process answer
            ans_iter = self.ans_to_ix[ans['answer']]
            
            img_path = self.img_path + ques["image_path"]
            
            transform = self.transform
            image = Image.open(img_path).convert('RGB')
            image = transform(image)

        return ques_ix_iter, \
               ans_iter, \
               image


    def __len__(self):
        return self.data_size
        #return 100