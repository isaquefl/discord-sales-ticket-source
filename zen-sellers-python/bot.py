import discord
from discord import app_commands
from discord.ext import commands
import config
from emojis import *

# Configurar intents
intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"✅ Bot {bot.user.name} está online!")
    
    # Sincronizar comandos
    try:
        synced = await bot.tree.sync()
        print(f"✅ {len(synced)} comandos sincronizados!")
    except Exception as e:
        print(f"❌ Erro ao sincronizar: {e}")

# COMANDO /painel
@bot.tree.command(name="painel", description="Abre o painel de controle do ZenT")
async def painel(interaction: discord.Interaction):
    # Mensagem de carregamento
    await interaction.response.send_message(f"{carregando} Abrindo Painel...")
    
    # Embed do painel
    embed = discord.Embed(
        title="📋 Painel de Controle",
        description="Boa noite, Aqui você pode gerenciar sua aplicação com total liberdade.\n\n**ZenSallers**",
        color=discord.Color.blue()
    )
    embed.set_image(url="https://i.imgur.com/QKjL8nW.png")  # TROCA DEPOIS
    embed.set_footer(text="ZenT Bot • Painel de Controle")
    
    # Criar botões (Linha 1)
    view = discord.ui.View()
    
    view.add_item(discord.ui.Button(
        label=f"{loja} Minha loja",
        style=discord.ButtonStyle.secondary,
        custom_id="minha_loja"
    ))
    view.add_item(discord.ui.Button(
        label=f"{ticket} Ticket",
        style=discord.ButtonStyle.secondary,
        custom_id="ticket"
    ))
    view.add_item(discord.ui.Button(
        label=f"{boas_vindas} Boas-Vindas",
        style=discord.ButtonStyle.secondary,
        custom_id="boas_vindas"
    ))
    view.add_item(discord.ui.Button(
        label=f"{automacoes} Automações",
        style=discord.ButtonStyle.secondary,
        custom_id="automacoes"
    ))
    view.add_item(discord.ui.Button(
        label=f"{customizar} Customizar",
        style=discord.ButtonStyle.secondary,
        custom_id="customizar"
    ))
    
    # Editar a mensagem (remover carregamento e mostrar painel)
    await interaction.edit_original_response(
        content=None,
        embed=embed,
        view=view
    )
    
    # Linha 2 (segunda mensagem com mais 5 botões)
    view2 = discord.ui.View()
    
    view2.add_item(discord.ui.Button(
        label=f"{zen_cloud} zenCloud",
        style=discord.ButtonStyle.secondary,
        custom_id="zencloud"
    ))
    view2.add_item(discord.ui.Button(
        label=f"{extrato} Extrato",
        style=discord.ButtonStyle.secondary,
        custom_id="extrato"
    ))
    view2.add_item(discord.ui.Button(
        label=f"{giveaway} Giveaway",
        style=discord.ButtonStyle.secondary,
        custom_id="giveaway"
    ))
    view2.add_item(discord.ui.Button(
        label=f"{configuracoes} Configurações",
        style=discord.ButtonStyle.secondary,
        custom_id="configuracoes"
    ))
    view2.add_item(discord.ui.Button(
        label=f"{zen_protect} zenProtect",
        style=discord.ButtonStyle.secondary,
        custom_id="zenprotect"
    ))
    
    # Enviar segunda linha (ephemeral = só quem chamou vê)
    await interaction.followup.send(
        view=view2,
        ephemeral=True
    )

# TRATAR OS BOTÕES
@bot.event
async def on_interaction(interaction: discord.Interaction):
    if interaction.type == discord.InteractionType.component:
        custom_id = interaction.data.get("custom_id")
        
        # Aqui você vai colocando as funções de cada botão
        if custom_id == "minha_loja":
            await interaction.response.send_message("🛒 Abrindo Minha Loja...", ephemeral=True)
        elif custom_id == "ticket":
            await interaction.response.send_message("🎫 Abrindo Ticket...", ephemeral=True)
        elif custom_id == "boas_vindas":
            await interaction.response.send_message("👋 Abrindo Boas-Vindas...", ephemeral=True)
        elif custom_id == "automacoes":
            await interaction.response.send_message("⚙️ Abrindo Automações...", ephemeral=True)
        elif custom_id == "customizar":
            await interaction.response.send_message("🎨 Abrindo Customizar...", ephemeral=True)
        elif custom_id == "zencloud":
            await interaction.response.send_message("☁️ Abrindo zenCloud...", ephemeral=True)
        elif custom_id == "extrato":
            await interaction.response.send_message("📊 Abrindo Extrato...", ephemeral=True)
        elif custom_id == "giveaway":
            await interaction.response.send_message("🎁 Abrindo Giveaway...", ephemeral=True)
        elif custom_id == "configuracoes":
            await interaction.response.send_message("🔧 Abrindo Configurações...", ephemeral=True)
        elif custom_id == "zenprotect":
            await interaction.response.send_message("🛡️ Abrindo zenProtect...", ephemeral=True)

bot.run(config.TOKEN)