"""Gera o PDF acadêmico a partir da fonte Markdown revisável."""
from pathlib import Path
import re
from html import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, KeepTogether,
)

raiz = Path(__file__).resolve().parent.parent
destino = raiz / 'output/pdf/trabalho-dinnos.pdf'
destino.parent.mkdir(parents=True, exist_ok=True)
fontes = Path('C:/Windows/Fonts')
for nome, arquivo in [('Texto', 'times.ttf'), ('TextoNegrito', 'timesbd.ttf'), ('TextoItalico', 'timesi.ttf')]:
    pdfmetrics.registerFont(TTFont(nome, str(fontes / arquivo)))
pdfmetrics.registerFontFamily('Texto', normal='Texto', bold='TextoNegrito', italic='TextoItalico', boldItalic='TextoNegrito')
estilos = getSampleStyleSheet()
estilos.add(ParagraphStyle('Corpo', fontName='Texto', fontSize=12, leading=17,
    alignment=TA_JUSTIFY, spaceAfter=9, splitLongWords=True))
estilos.add(ParagraphStyle('TituloRelatorio', fontName='TextoNegrito', fontSize=20,
    leading=25, alignment=TA_CENTER, spaceAfter=20))
estilos.add(ParagraphStyle('SecaoRelatorio', fontName='TextoNegrito', fontSize=14,
    leading=19, spaceBefore=17, spaceAfter=9, keepWithNext=True))
estilos.add(ParagraphStyle('SubsecaoRelatorio', parent=estilos['SecaoRelatorio'], fontSize=12, leading=17))
estilos.add(ParagraphStyle('LegendaRelatorio', fontName='Texto', fontSize=10,
    leading=13, spaceAfter=12))
estilos.add(ParagraphStyle('CentroRelatorio', parent=estilos['Corpo'], alignment=TA_CENTER))
estilos.add(ParagraphStyle('FluxoRelatorio', fontName='Texto', fontSize=11,
    leading=16, leftIndent=10, spaceAfter=5))
estilos.add(ParagraphStyle('ReferenciaRelatorio', parent=estilos['Corpo'], alignment=TA_LEFT))

def formatar(texto):
    texto = escape(texto)
    texto = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', texto)
    texto = re.sub(r'`([^`]+)`', r'\1', texto)
    texto = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'<link href="\2" color="#163b2b">\1</link>', texto)
    return texto

conteudo = []
conteudo.append(Paragraph('Análise e Desenvolvimento de Sistemas', estilos['CentroRelatorio']))
conteudo.append(Spacer(1, 0.8*cm))
conteudo.append(Paragraph('Samuel Quintão Rodrigues Santiago', estilos['CentroRelatorio']))
conteudo.append(Spacer(1, 1*cm))
conteudo.append(Image(str(raiz/'trabalho/imagens/logo-dinos.png'), width=5*cm, height=5*cm))
conteudo.append(Spacer(1, 1*cm))
conteudo.append(Paragraph('DINNOS aplicação web para registro e consulta de pedidos da Dino’s Pizzaria', estilos['TituloRelatorio']))
conteudo.append(Paragraph('Disciplina de Estágio Supervisionado', estilos['CentroRelatorio']))
conteudo.append(Spacer(1, 1*cm))
conteudo.append(Paragraph('Relatório do projeto acadêmico', estilos['CentroRelatorio']))
conteudo.append(Paragraph('2026', estilos['CentroRelatorio']))
conteudo.append(PageBreak())

texto = (raiz/'trabalho/trabalho-final.md').read_text(encoding='utf-8')
blocos = re.split(r'\n\s*\n', texto)
ignorar_legenda = False
em_referencias = False
for indice, bloco in enumerate(blocos):
    bloco = bloco.strip()
    if not bloco:
        continue
    if ignorar_legenda:
        ignorar_legenda = False
        continue
    if bloco.startswith('# ') or bloco.startswith('Autor:') or bloco.startswith('Disciplina:'):
        continue
    if bloco.startswith('!['):
        caminho = re.search(r'\]\(([^)]+)\)', bloco).group(1)
        if caminho == 'imagens/logo-dinos.png':
            continue
        imagem = Image(str((raiz/'trabalho'/caminho).resolve()))
        proporcao = min(16*cm/imagem.imageWidth, 9.3*cm/imagem.imageHeight)
        imagem.drawWidth = imagem.imageWidth*proporcao
        imagem.drawHeight = imagem.imageHeight*proporcao
        legenda = ' '.join(blocos[indice+1].splitlines())
        conteudo.append(KeepTogether([Spacer(1, 8), imagem,
            Spacer(1, 5), Paragraph(formatar(legenda), estilos['LegendaRelatorio'])]))
        ignorar_legenda = True
    elif bloco.startswith('### '):
        if bloco.startswith('### 6.2 '):
            conteudo.append(PageBreak())
        conteudo.append(Paragraph(formatar(bloco[4:]), estilos['SubsecaoRelatorio']))
    elif bloco.startswith('## '):
        em_referencias = bloco[3:] == 'Referências'
        conteudo.append(Paragraph(formatar(bloco[3:]), estilos['SecaoRelatorio']))
    elif bloco.startswith('```'):
        for linha in bloco.splitlines()[1:-1]:
            conteudo.append(Paragraph(escape(linha).replace('  ', '&nbsp;&nbsp;'), estilos['FluxoRelatorio']))
    elif re.match(r'^\d+\. ', bloco):
        for linha in re.split(r'\n(?=\d+\. )', bloco):
            conteudo.append(Paragraph(formatar(' '.join(linha.splitlines())), estilos['Corpo']))
    else:
        conteudo.append(Paragraph(formatar(' '.join(bloco.splitlines())), estilos['ReferenciaRelatorio' if em_referencias else 'Corpo']))

def numerar(tela, documento):
    if documento.page == 1:
        return
    tela.saveState()
    tela.setFont('Texto', 9)
    tela.setFillColor(colors.HexColor('#333333'))
    tela.drawRightString(letter[0]-2.2*cm, 1.3*cm, str(documento.page))
    tela.restoreState()

documento = SimpleDocTemplate(str(destino), pagesize=letter,
    rightMargin=2.2*cm, leftMargin=2.5*cm, topMargin=2.2*cm, bottomMargin=2*cm,
    title='DINNOS registro e consulta de pedidos', author='Samuel Quintão Rodrigues Santiago')
documento.build(conteudo, onFirstPage=numerar, onLaterPages=numerar)
print(destino)
