from jiwer import wer

reference = "मेरा नाम दिया है"
prediction = "मेरा नाम दीया है"

error = wer(reference, prediction)

print("WER:", error)
